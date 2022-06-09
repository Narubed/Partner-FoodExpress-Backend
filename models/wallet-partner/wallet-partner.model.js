const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const walletSchema = new mongoose.Schema({
  wallet_partner_id: { type: String, required: true },
  wallet_partner_total: { type: Number, required: true },
});

walletSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Wallet = mongoose.model("wallet_partner", walletSchema);

const validate = (data) => {
  const schema = Joi.object({
    wallet_partner_id: Joi.string(),
    wallet_partner_total: Joi.number().precision(2),
  });
  return schema.validate(data);
};

module.exports = { Wallet, validate };
