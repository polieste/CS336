from fastapi import FastAPI, File, UploadFile

from PIL import Image
import numpy as np
from sklearn.neighbors import KDTree
from lshashpy3 import LSHash
import faiss

from setup.feature_extraction import FeatureExtractor
from setup.indexing import Index

index_path = './data/features/features_no_pca.h5'

features, names = Index(name=index_path).get()

# kd-tree
kdtree_features = KDTree(features)
# LSH
lsh = LSHash(8, features.shape[1], 2)
for i in range(len(features)):
    lsh.index(features[i], extra_data=names[i])
# faiss
index_flat = faiss.IndexFlatL2(features.shape[1])
if faiss.get_num_gpus() > 0:
    # Using GPU
    res = faiss.StandardGpuResources()
    index_flat = faiss.index_cpu_to_gpu(res, 0, index_flat)
index_flat.train(features)
index_flat.add(features)

extractor = FeatureExtractor()

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/search/{method}/{topK}")
def search(croppedImage: UploadFile, method: str, topK: int):
    contents = croppedImage.file

    img = Image.open(contents)

    query = extractor.extract(img)

    if method == 'kdtree':
        # Large scale search using kd-tree
        query = np.expand_dims(query, axis=0)
        dists, ids = kdtree_features.query(query, k=topK)
        dists = np.squeeze(dists, axis=0)
        ids = np.squeeze(ids, axis=0)
        results = [{"name": str(names[index_img], 'utf-8'),
                    "dist": round(float(dists[i]), 6)} for i, index_img in enumerate(ids)]

        return results
    elif method == 'lsh':
        # Large scale search using LSH
        lsh_search = lsh.query(query, num_results=topK)
        results = [{"name": str(name, 'utf-8'),
                    "dist": round(float(dist), 6)} for ((vec, name), dist) in lsh_search]
        return results
  
    elif method == 'faiss':
        # Large scale search using faiss
        query = np.expand_dims(query, axis=0)
        dists, ids = index_flat.search(query, topK)
        dists = np.squeeze(dists, axis=0)
        ids = np.squeeze(ids, axis=0)
        results = [{"name": str(names[index_img], 'utf-8'), 
                    "dist": round(float(dists[i]), 6)} for i, index_img in enumerate(ids)]
        return results
    else:   
    # Normal calculate euclid distance
        dists = np.linalg.norm(features - query, axis=1)
        ids = np.argsort(dists)[:topK]
        results = [{"name": str(names[index_img], 'utf-8'),
                    "dist": round(float(dists[index_img]), 6)} for index_img in ids]
        return results