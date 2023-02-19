# Image Retrieval using React.js and FastAPI

This repository contains an application for retrieving images using React.js with [Vite](https://vitejs.dev/) as a client-side framework and [FastAPI](https://fastapi.tiangolo.com/) as a server-side framework. The user can search for images based on a region of image, and the application retrieves and displays images.

## Data preparation:
### Use our prepared data:
* Download `images` folder from [link](https://drive.google.com/drive/folders/1sHnC666LpfVcSdUyOw9Cu7wBN0kgUGgo?usp=share_link) to `client/public/`.
* Download all folders (`features`, `images`, `gt_files`) from [link](https://drive.google.com/drive/folders/1sHnC666LpfVcSdUyOw9Cu7wBN0kgUGgo?usp=share_link) to `server/data`.
### Or:

## Installation
This application is built on `Node.js v16.8.0` and `Conda v4.12.0`.

### Client-side Installation
* Navigate to the `client` directory:
```bash
cd client
```
* Install the necessary dependencies:
```bash
npm install
```
### Server-side Installation
* Navigate to the `server` directory:
```bash
cd server
```
* Create a `python 3.8` conda virtual environment and activate it:
```bash
conda create --name <env_name> python=3.8
conda activate <env_name>
```
* Install the necessary dependencies:
```bash
pip install -r requirements.txt
```
## Usage
* Navigate to the `client` directory:
```bash
cd client
```
* Start the client-side development server:
```bash
npm run dev
```
* Navigate to the `server` directory:
```bash
cd server
```
* Activate virtual environment:
```bash
conda activate <env_name>
```
* Start the server:
```bash
uvicorn main:app --reload
```

## Extract Feature

* Change directory to setup folder:
```bash
cd server/setup
```

* Export feature indexing file to path:
```bash
python export_feature.py [-path]
  -path: Path to save features file (including file name.h5)
```

## Evaluation:

* Change directory to setup folder:
```bash
cd server/setup
```

* Run system evaluation:
```bash
python evaluation.py [-large] [-feature] [-top]
  -large = argsort if None
         = ['kdtree', 'lsh', 'faiss']    Large scale method
  -feature = [PATH]                      Features indexing file path
  -top = [INT]                           Number of ranked lists element (compulsory)
 ```

* Compare efficience of methods:
```bash
python compare_time.py
```

## Contribution
| Student Code | Name  | Github  |
| -------- | ------------------ | ----- |
| 20521011 | Nguyen Tran Tien | https://github.com/tiennt235/ |
| 20521394 | Le Nguyen Minh Huy | https://github.com/polieste/ |
