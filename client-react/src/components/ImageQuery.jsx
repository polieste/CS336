import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input"

import SearchIcon from "@mui/icons-material/Search"

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const SERVER = ""

const ImageQuery = () => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState();

  const handleChange = (e) => {
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

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      cropper.getCroppedCanvas().toBlob((blob) => {
        fetch(`/search`, {
          method: "POST",
          body: blob
        }).then(
          response => response.json()
        ).then(
          success => console.log(success)
        ).catch(
          error => console.log(error)
        );
      });
    }
  };

  return (
    <Box>
      <h3>Upload image</h3>
      <Input
        type="file"
        name="myImage"
        onChange={handleChange}
      />
      {image && (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "50%", height: 600, padding: 1 }}>
            <h3>Searching image {imageName}</h3>
            <Cropper
              src={image}
              style={{ height: "100%", width: "100%" }}
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
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
            <Button variant="contained" startIcon={<SearchIcon />} onClick={getCropData}>Search</Button>
          </Box>
          {cropData &&
            <Box sx={{ width: "40%", height: 600, padding: 1 }}>
              <h3>Cropped image</h3>
              <img
                src={cropData}
                alt="cropped"
                style={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%", }} />
            </Box>}
        </Box>
      )}
    </Box>
  );
};

export default ImageQuery;