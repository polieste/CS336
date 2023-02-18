import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function ImageGrid({imageData}) {
  return (
    <ImageList cols={5} >
      {imageData.map((item) => (
        <ImageListItem key={item.name}>
          <img
            src={`images/${item.name}`}
            // srcSet={`${item.name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={item.dist}
            loading="lazy"
            style={{height: 300, objectFit: "contain"}}
          />
          <ImageListItemBar
            title={item.name.slice(0, -4)}
            subtitle={<span>distance: {item.dist}</span>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
