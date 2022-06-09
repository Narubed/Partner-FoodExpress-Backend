const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const {
  Wallet,
  validate,
} = require("../../models/wallet-partner/wallet-partner.model");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    console.log(error);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    const result = await new Wallet({
      ...req.body,
    }).save();
    console.log(result._id);
    res.status(201).send({
      message: "สร้างรายงานสำเร็จ",
      status: true,
      order_id: result._id,
    });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.findAll = async (req, res) => {
  try {
    Wallet.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Wallet.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหารายงานนี้ได้", status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    });
};

exports.findOnePartner = (req, res) => {
  const id = req.params.id;
  Wallet.find({ wallet_partner_id: id })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหารายงานนี้ได้", status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Wallet.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `ไม่สามารถลบรายงานนี้ได้`,
          status: true,
        });
      } else {
        res.send({
          message: "ลบรายงานสำเร็จ",
          status: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "ไม่สามารถลบรายงานนี้ได้",
        status: false,
      });
    });
};

exports.update = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    const id = req.params.id;
    Wallet.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถเเก้ไขรายงานนี้ได้`,
          });
        } else res.send({ message: "แก้ไขรายงานสำเร็จ", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถเเก้ไขรายงานนี้ได้",
          status: false,
        });
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: "ไม่สามารถเเก้ไขรายงานนี้ได้", status: false });
  }
};
