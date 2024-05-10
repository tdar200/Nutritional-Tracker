import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NutritonTable from "./NutritonTable";

import axios from "axios";

const APP_ID = "efc757fd";
const APP_KEY = "c19c2e7da81c9f16aff162fb0c6cc9ff";
const API_URL = "https://api.edamam.com/api/nutrition-data";

function App() {
  const [ingredient, setIngredient] = useState("");
  const [response, setResponse] = useState(null);

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
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Ingredient"
          variant="outlined"
          onChange={handleChange}
          onKeyDown={handleEnterKeyPress}
        />
      </Box>

      <NutritonTable data={response} />
    </>
  );
}

export default App;
