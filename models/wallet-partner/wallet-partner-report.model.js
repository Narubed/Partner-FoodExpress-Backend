const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const walletReportSchema = new mongoose.Schema({
  wpr_partner_id: { type: String, required: true },
  wpr_partner_total: { type: Number, required: true },
  wpr_status: { type: String, required: true, default: "รอรับค่าคอมมิชชั่น" },
  wpr_slip: { type: String, required: false, default: "" },
  wpr_timestamp: { type: Date, required: true, default: Date.now() },
});

walletReportSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const WalletReport = mongoose.model(
  "wallet_partner_report",
  walletReportSchema
);

const validate = (data) => {
  const schema = Joi.object({
    wpr_partner_id: Joi.string(),
    wpr_partner_total: Joi.number().precision(3),
    wpr_status: Joi.string().default("รอรับค่าคอมมิชชั่น"),
    wpr_slip: Joi.string().default(""),
    wpr_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { WalletReport, validate };
