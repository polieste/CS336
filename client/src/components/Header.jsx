import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';

const imgStyle = {
  // width: "100%",
  height: "10vmin",
  padding: 10,
}

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: 2,
        gap: 1,
      }}
    >
      <Box>
        <img src="assets/logoUIT.png" style={imgStyle} />
        <img src="assets/logoCS.png" style={imgStyle} />
      </Box>
      <Box item xs={7}>
        <Typography fontSize={40} fontFamily={'sans-serif'} color={'#20409A'} fontWeight={600} textAlign='center' style={{}}>
          IMAGE RETRIEVAL SYSTEM
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexFlow: "column", gap: 1 }}>
        <Typography textAlign='center' >
          CS336 Project - Made by:
        </Typography>
        <Typography textAlign='center' fontStyle={'italic'}>
          Nguyễn Trần Tiến, Lê Nguyễn Minh Huy
        </Typography>
      </Box>
    </Box>
  );
}