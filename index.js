require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");

// const deleteImage = require("./routes/deleteImage");

connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
// app.use("/api/nbadigitalservice/deleteImage", deleteImage);

const port = process.env.PORT || 8090;
app.listen(port, console.log(`Listening on port ${port}...`));
