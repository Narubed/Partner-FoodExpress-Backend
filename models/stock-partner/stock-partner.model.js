const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const stockSchema = new mongoose.Schema({
  stock_partner_id: { type: String, required: true },
  stock_product_id: { type: Number, required: true },
  stock_product_name: { type: String, required: true },
  stock_product_amount: { type: Number, required: true },
});

stockSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Stock = mongoose.model("stock_partner", stockSchema);

const validate = (data) => {
  const schema = Joi.object({
    stock_partner_id: Joi.string(),
    stock_product_id: Joi.number().precision(2),
    stock_product_name: Joi.string(),
    stock_product_amount: Joi.number().precision(2),
  });
  return schema.validate(data);
};

module.exports = { Stock, validate };
