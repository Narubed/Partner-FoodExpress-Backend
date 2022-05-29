const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { OrderDetail, validate } = require("../models/order-detail.model");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    console.log(error);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    const result = await new OrderDetail({
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
    OrderDetail.find()
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
  OrderDetail.findById(id)
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

exports.findOrderOne = (req, res) => {
  const id = req.params.id;
  OrderDetail.find({ odd_order_id: id })
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

  OrderDetail.findByIdAndRemove(id, { useFindAndModify: false })
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