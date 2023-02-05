import "./App.css";

import { useState } from "react";
import Box from "@mui/material/Box";

import Header from "./components/Header";
import ImageGrid from "./components/ImageGrid";
import ImageQuery from "./components/ImageQuery";

function App() {
  const [imageData, setImageData] = useState(null);

  const setData = (data) => {
    setImageData(data);
  };

  console.log(imageData)
  
  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <ImageQuery setData={setData}/>
      {imageData && (<ImageGrid imageData={imageData} />)}
    </Box>
  );
}

export default App;
