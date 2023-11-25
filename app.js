const express = require("express");
const mongoose = require("mongoose");
const router = require("./MVC/Routes/router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
