import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input"
import TextField from "@mui/material/TextField"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import SearchIcon from "@mui/icons-material/Search"

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Grid, Typography } from "@mui/material";

const SERVER = "http://127.0.0.1:8000"

const ImageQuery = ({ setData }) => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);

  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState();

  const [topK, setTopK] = useState(50);

  const [method, setMethod] = useState("kdtree");

  const handleFileChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImageName(files[0].name.slice(0, -4))
    };
    reader.readAsDataURL(files[0]);
  };

  const handleTopKChange = (event) => {
    setTopK(event.target.value)
  }

  const handleMethodChange = (event) => {
    setMethod(event.target.value)
  }

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData();

        formData.append('croppedImage', blob)

        fetch(`/search/${method}/${topK}`, {
          method: "POST",
          body: formData
        }).then(
          response => response.json()
        ).then(
          data => setData(data)
        ).catch(
          error => console.log(error)
        );
      });
    }
  };

  return (
    <Box style={{ top: 20, display: "flex", flexFlow: "column", alignItems: "center" }}>
      <label htmlFor="imageUploader"
        style={{
          height: 150,
          width: 400,
          border: "3px dashed #2F6BFF",
          borderRadius: 10,
          position: "relative",
          cursor: "pointer",
        }}
      >
        <input
          id="imageUploader"
          type="file"
          name="imageUploader"
          onChange={handleFileChange}
          style={{
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <Box style={{
          width: "max-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: -1,

        }}>
          <img src="./assets/upload.png" style={{ height: 50 }} />
          <Typography color={''} fontStyle={'italic'}>
            Drop file here or Click to upload image
          </Typography>
        </Box>
      </label>
      {image && (
        <Grid container sx={{ marginTop: 5, marginBottom: 5, }}>
          <Grid item xs={5.5} sx={{ padding: 1 }}>
            <h3>Searching image {imageName}</h3>
            <Cropper
              src={image}
              style={{ height: 500 }}
              zoomTo={0.5}
              initialAspectRatio={1}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={false}
              zoomable={false}
              cropBoxMovable={false}
            />
          </Grid>
          <Grid item xs={1.5} sx={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            padding: 1,
            justifyContent: "center",
            gap: 2,
          }}>

            <FormControl fullWidth>
              <InputLabel id="method">Method</InputLabel>
              <Select
                labelId="method"
                id="demo-simple-select"
                label="Method"
                value={method}
                onChange={handleMethodChange}
              >
                <MenuItem value={"argsort"}>argsort</MenuItem>
                <MenuItem value={"lsh"}>LSH</MenuItem>
                <MenuItem value={"faiss"}>faiss-FlatL2</MenuItem>
                <MenuItem value={"kdtree"}>kd-tree</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="outlined-number"
              label="Top K"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={topK}
              onChange={handleTopKChange}
            />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={getCropData}>Search</Button>
          </Grid>
          <Grid item xs={5}>
            {cropData &&
              <Box sx={{ height: 500 }}>
                <h3>Cropped image</h3>
                <img
                  src={cropData}
                  alt="cropped"
                  style={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%", }} />
              </Box>}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ImageQuery;
export default ImageQuery;