import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';

import SearchIcon from "@mui/icons-material/Search";

const BACKEND_URL = ""

export default function QueryForm({ setData }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("submited")

    fetch(`${BACKEND_URL}/api/${query}`)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(err => console.log('Error: ', err))
  }

  console.log(query)
  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={8}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
              variant="outlined"
              place
              value={query}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="outlined"
                type="submit"
                onClick={handleSubmit}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}