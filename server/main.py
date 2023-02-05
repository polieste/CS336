from typing import Union

from fastapi import FastAPI, File, UploadFile

from PIL import Image
import numpy as np
from sklearn.neighbors import KDTree

from setup.feature_extraction import FeatureExtractor
from setup.indexing import Index
from setup.dimension_reduction import perform_pca_on_single_vector


DATA_PATH = ""
index_path = './static/data/features_no_pca.h5'

features, names = Index(name=index_path).get()
features = KDTree(features)

extractor = FeatureExtractor()

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/search/{topK}")
def search(croppedImage: UploadFile, topK: int):
    contents = croppedImage.file

    img = Image.open(contents)

    query = extractor.extract(img)
    # PCA
    # if args['pca'] is not None:
    #     query = perform_pca_on_single_vector(query, 5, 512)

    # if args['large'] is not None:
    #     if args['large'] == 'kdtree':
    #         # Large scale search using kd-tree
    query = np.expand_dims(query, axis=0)
    dists, ids = features.query(query, k=topK)
    dists = np.squeeze(dists, axis=0)
    ids = np.squeeze(ids, axis=0)
    results = [{"name": str(names[index_img], 'utf-8'),
                "score": round(float(dists[i]), 6)} for i, index_img in enumerate(ids)]

    return results
    # elif args['large'] == 'lsh':
    #     # Large scale search using LSH
    #     lsh_search = lsh.query(query, num_results=30)
    #     print(lsh_search)
    #     results = [(DATA_PATH + str(name, 'utf-8'), float(dist)) for ((vec, name), dist) in lsh_search]
    # elif args['large'] == 'faiss':
    #     # Large scale search using faiss
    #     query = np.expand_dims(query, axis=0)
    #     dists, ids = index_flat.search(query, 30)
    #     dists = np.squeeze(dists, axis=0)
    #     ids = np.squeeze(ids, axis=0)
    #     results = [(DATA_PATH + str(names[index_img], 'utf-8'), float(dists[i])) for i, index_img in
    #                enumerate(ids)]
    # else:
    # Normal calculate euclid distance
    # dists = np.linalg.norm(features - query, axis=1)
    # ids = np.argsort(dists)[:30]
    # results = [(DATA_PATH + str(names[index_img], 'utf-8'),
    #             float(dists[index_img])) for index_img in ids]

#     time_span = time.time() - start
#     return jsonify({'time': time_span, 'results': dict(results)})
# else:
#     return render_template('index.html')
    # img.show()

    # return {"filename": img.size}
