const axios = require("axios");
const express = require("express");

const app = express();

const APP_ID = "efc757fd";
const APP_KEY = "c19c2e7da81c9f16aff162fb0c6cc9ff";
const API_URL = "https://api.edamam.com/api/nutrition-data";

const searchFood = "orange juice";
const quantity = 1;

// Construct the API URL with query parameters
const apiUrlWithParams = `${API_URL}?ingr=${quantity}%20${searchFood}&app_id=${APP_ID}&app_key=${APP_KEY}`;

// Make the API request
axios
  .get(apiUrlWithParams)
  .then((response) => {
    console.log("Response:", response.data);
    // Process the response data here
  })
  .catch((error) => {
    console.error("Error:", error);
  });

app.listen(3000);
