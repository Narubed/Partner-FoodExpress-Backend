const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const cutArountOrderSchema = new mongoose.Schema({
  cao_partner_id: { type: String, required: true },
  cao_level: { type: String, required: true },
  cao_level_name: { type: String, required: true },
  cao_first_date: { type: Date, required: true },
  cao_last_data: { type: Date, required: true },
  cao_status: { type: String, required: false, default: "ตัดรอบการจัดส่งแล้ว" },
  cao_timestamp: { type: Date, required: false, default: Date.now() },
});

cutArountOrderSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const CutArountOrder = mongoose.model("cut_arount_order", cutArountOrderSchema);

const validate = (data) => {
  const schema = Joi.object({
    cao_partner_id: Joi.string(),
    cao_level: Joi.string(),
    cao_level_name: Joi.string(),
    cao_first_date: Joi.date().raw().default(Date.now()),
    cao_last_data: Joi.date().raw().default(Date.now()),
    cao_status: Joi.string().default("ตัดรอบการจัดส่งแล้ว"),
    cao_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { CutArountOrder, validate };
