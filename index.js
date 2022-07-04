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
const wallet_partner = require("./rounts/wallet-partner");
const cut_arount_order = require("./rounts/cut-arount-order");
const stock_partner = require("./rounts/stock-partner");

connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/partner-foodexpress/order", order);
app.use("/api/partner-foodexpress/order_detail", order_detail);
app.use("/api/partner-foodexpress/wallet_partner", wallet_partner);
app.use("/api/partner-foodexpress/cut_arount_order", cut_arount_order);
app.use("/api/partner-foodexpress/stock_partner", stock_partner);

const port = process.env.PORT || 8090;
app.listen(port, console.log(`Listening on port ${port}...`));
