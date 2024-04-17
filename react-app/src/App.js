import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NutritonTable from "./NutritonTable";

import axios from "axios";

const APP_ID = "efc757fd";
const APP_KEY = "c19c2e7da81c9f16aff162fb0c6cc9ff";
const API_URL = "https://api.edamam.com/api/nutrition-data";

// const searchFood = "orange juice";
// const quantity = 1;

// // Construct the API URL with query parameters
// // const apiUrlWithParams = `${API_URL}?ingr=${quantity}%20${searchFood}&app_id=${APP_ID}&app_key=${APP_KEY}`;

// // Make the API request

function App() {
  const [ingredient, setIngredient] = useState("");
  const [response, setResponse] = useState(null);
  const [localData, setLocalData] = useState(null);

  // localStorage.clear();

  useEffect(() => {
    const value = JSON.parse(localStorage.getItem("ingredients"));
    setLocalData(value);
  }, []);

  useEffect(() => {
    const storageEventListener = (event) => {
      if (event.key === "ingredients") {
        const updatedValue = JSON.parse(event.newValue);
        setLocalData(updatedValue);
      }
    };

    window.addEventListener("storage", storageEventListener);

    return () => {
      window.removeEventListener("storage", storageEventListener);
    };
  }, []);

  console.log({
    datttt: JSON.parse(localStorage.getItem("ingredients")),
    localData,
  });

  const handleChange = (e) => {
    setIngredient(e.target.value.toLowerCase());
  };

  const handleEnterKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      try {
        const res = await axios.get(API_URL, {
          params: {
            ingr: `1 ${ingredient}`,
            app_id: APP_ID,
            app_key: APP_KEY,
          },
        });

        setResponse(res.data);

        console.log("API Response:", res.data);
        // Process the API response data here
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  return (
    <>
      {/* <div style={{ display: "flex", height: "100%", width: "100%" }}> */}
      <Box
        // component='form'
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete='off'>
        <TextField
          id='outlined-basic'
          label='Ingredient'
          variant='outlined'
          onChange={handleChange}
          onKeyDown={handleEnterKeyPress}
        />
      </Box>

      <NutritonTable
        data={response}
        localData={localData}
        setLocalData={setLocalData}
      />
      {/* </div> */}
    </>
  );
}

export default App;
