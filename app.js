const express = require("express");
const mongoose = require("mongoose");
const router = require("./MVC/Routes/router");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

const PORT = 4040;

mongoose
  .connect(
    "mongodb+srv://kabir_shhaikh:cWNdzBEfcOOPmcGW@kabir.5td6tgo.mongodb.net/"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port: ${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to the database" + err));
