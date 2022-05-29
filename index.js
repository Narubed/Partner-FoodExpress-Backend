require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");

const order = require("./rounts/order");
const order_detail = require("./rounts/order-detail");

connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/partner-foodexpress/order", order);
app.use("/api/partner-foodexpress/order_detail", order_detail);

const port = process.env.PORT || 8090;
app.listen(port, console.log(`Listening on port ${port}...`));
