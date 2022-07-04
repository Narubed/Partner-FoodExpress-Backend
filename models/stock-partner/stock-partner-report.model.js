const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const stockReportSchema = new mongoose.Schema({
  spr_partner_id: { type: String, required: true },
  spr_product_id: { type: Number, required: true },
  spr_product_name: { type: String, required: true },
  spr_product_amount: { type: Number, required: true },
  spr_status: { type: String, required: true },
  spr_timestamp: { type: Date, required: true, default: Date.now() },
});

stockReportSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const StockReport = mongoose.model("stock_partner_report", stockReportSchema);

const validate = (data) => {
  const schema = Joi.object({
    spr_partner_id: Joi.string(),
    spr_product_id: Joi.number().precision(2),
    spr_product_name: Joi.string(),
    spr_product_amount: Joi.number().precision(2),
    spr_status: Joi.string(),
    spr_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { StockReport, validate };
