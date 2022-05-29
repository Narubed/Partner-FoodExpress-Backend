const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const orderDetailSchema = new mongoose.Schema({
  odd_partner_id: { type: String, required: true },
  odd_order_id: { type: String, required: true },
  odd_status: { type: String, required: true, default: "ยังไม่ได้จัดส่ง" },
  odd_product_id: { type: Number, required: true },
  odd_product_name: { type: String, required: true },
  odd_product_cost: { type: Number, required: true },
  odd_product_price: { type: Number, required: true },
  odd_product_amount: { type: Number, required: true },
  odd_product_currency: { type: String, required: true },
  odd_product_unitkg: { type: Number, required: true },
  odd_cutarount_id: { type: String, required: false, default: "" },
  odd_timestamp: { type: Date, required: true, default: new Date() },
});

orderDetailSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const OrderDetail = mongoose.model("order_detail", orderDetailSchema);

const validate = (data) => {
  const schema = Joi.object({
    odd_partner_id: Joi.string().required().label("_id ผู้ใช่"),
    odd_order_id: Joi.string().required().label("odd_order_id"),
    odd_status: Joi.string().default("ยังไม่ได้จัดส่ง"),
    odd_product_id: Joi.number()
      .precision(2)
      .required()
      .label("odd_product_id"),
    odd_product_name: Joi.string().required().label("odd_product_name "),
    odd_product_cost: Joi.number()
      .precision(2)
      .required()
      .label("odd_product_cost"),
    odd_product_price: Joi.number()
      .precision(2)
      .required()
      .label("odd_product_price"),
    odd_product_amount: Joi.number()
      .precision(2)
      .required()
      .label("odd_product_amount"),
    odd_product_currency: Joi.string().required().label("odd_product_currency"),
    odd_product_unitkg: Joi.number()
      .precision(2)
      .required()
      .label("odd_product_unitkg"),
    // odd_cutarount_id: Joi.string().required().label("_id ผู้ใช่"),
    // odd_timestamp: Joi.string().required().label("_id ผู้ใช่"),
  });
  return schema.validate(data);
};

module.exports = { OrderDetail, validate };
