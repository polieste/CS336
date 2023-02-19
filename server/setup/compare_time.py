import time
import numpy as np
from feature_extraction import FeatureExtractor
from indexing import Index
from PIL import Image
from sklearn.neighbors import KDTree
from lshashpy3 import LSHash
import argparse
import faiss
import os
import random
import constants

ap = argparse.ArgumentParser()
ap.add_argument("--num", type=int, required=True, help="Number of query images")
ap.add_argument("--feature", required=False, help="Features indexing file path")
args = vars(ap.parse_args())

img_path = constants.IMG_PATH

def main():
    extractor = FeatureExtractor()
    
    list_images = os.listdir(img_path)
    query_images = [random.choice(list_images) for _ in range(int(args['num']))]
    for method in ['No large scale', 'pca', 'kdtree', 'lsh', 'faiss']:
        index_path = constants.FEATURE_PATH
        if args['feature'] is not None:
            index_path = args['feature']
        features, names = Index(name=index_path).get()
        time_arr = []
        if method == 'kdtree':
            features = KDTree(features)
        elif method == 'lsh':
            lsh = LSHash(8, features.shape[1], 2)
            for i in range(len(features)):
                lsh.index(features[i], extra_data=names[i])
        elif method == 'faiss':
            index_flat = faiss.IndexFlatL2(features.shape[1])
            if faiss.get_num_gpus() > 0:
                res = faiss.StandardGpuResources()
                index_flat = faiss.index_cpu_to_gpu(res, 0, index_flat)
            index_flat.train(features)
            index_flat.add(features)

        for img in query_images:
            start = time.time()
            try:
                img = Image.open(os.path.join(img_path, img))
            except:
                continue

            query = extractor.extract(img)
    
            if method == 'kdtree':
                query = np.expand_dims(query, axis=0)
                dists, ids = features.query(query, k=30)
            elif method == 'lsh':
                lsh_search = lsh.query(query, num_results=30)
            elif method == 'faiss':
                query = np.expand_dims(query, axis=0)
                dists, ids = index_flat.search(query, 30)
            else:
                dists = np.linalg.norm(features - query, axis=1)
                ids = np.argsort(dists)[:30]
            time_span = time.time() - start
            time_arr.append(time_span)
        print(f'{method}: {np.mean(np.array(time_arr))}')

if __name__ == "__main__":
    main()