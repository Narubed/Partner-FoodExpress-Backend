const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const orderSchema = new mongoose.Schema({
  order_partner_id: { type: String, required: true },
  order_partner_status: { type: String, required: true, default: "รอชำระเงิน" },
  order_partner_image: { type: String, required: false, default: "" },
  order_partner_total: { type: Number, required: true },
  order_partner_timestamp: { type: Date, required: true, default: new Date() },
});

orderSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Order = mongoose.model("order", orderSchema);

const validate = (data) => {
  const schema = Joi.object({
    order_partner_id: Joi.string(),
    order_partner_status: Joi.string().default("รอชำระเงิน"),
    // order_partner_image: Joi.string().default(""),
    order_partner_total: Joi.number().precision(2),
    // order_partner_timestamp: Joi.string().required().label("order_partner_timestamp"),
  });
  return schema.validate(data);
};

module.exports = { Order, validate };
