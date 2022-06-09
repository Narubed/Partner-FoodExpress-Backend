const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const {
  WalletReport,
  validate,
} = require("../../models/wallet-partner/wallet-partner-report.model");

const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    console.log("error=>", error);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    const result = await new WalletReport({
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

exports.findAllR = async (req, res) => {
  try {
    WalletReport.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  WalletReport.findById(id)
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

  WalletReport.findByIdAndRemove(id, { useFindAndModify: false })
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

exports.updateSlip = async (req, res) => {
  console.log(req.params.id);
  try {
    let upload = multer({ storage: storage }).single("wpr_slip");
    upload(req, res, function (err) {
      if (!req.file) {
        if (!req.body) {
          return res.status(400).send({
            message: "การส่งข้อมูลไม่ถูกต้อง",
          });
        }
        const { error } = validate(req.body);
        if (error)
          return res
            .status(400)
            .send({ message: error.details[0].message, status: false });

        const id = req.params.id;
        WalletReport.findByIdAndUpdate(
          id,
          { ...req.body },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขรายงานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขรายงานสำเร็จ",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขรายงานนี้ได้",
              status: false,
            });
          });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFileEdit(req, res);
      }
    });
    async function uploadFileEdit(req, res) {
      const filePath = req.file.path;
      let fileMetaData = {
        name: req.file.originalname,
        parents: ["1kFTSmJYKeUHzN1pQTvX_2SPymhETQknM"],
      };
      let media = {
        body: fs.createReadStream(filePath),
      };
      try {
        const response = await drive.files.create({
          resource: fileMetaData,
          media: media,
        });
        generatePublicUrl(response.data.id);
        const { error } = validate(req.body);
        if (error)
          return res
            .status(400)
            .send({ message: error.details[0].message, status: false });
        const id = req.params.id;
        WalletReport.findByIdAndUpdate(
          id,
          { ...req.body, wpr_slip: response.data.id },
          { useFindAndModify: false }
        )
          .then(async (data) => {
            if (!data) {
              await drive.files.delete({
                fileId: response.data.id.toString(),
              });
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขรายงานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขรายงานสำเร็จ",
                status: true,
              });
          })
          .catch(async (err) => {
            await drive.files.delete({
              fileId: response.data.id.toString(),
            });
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขรายงานนี้ได้",
              status: false,
            });
          });
      } catch (error) {
        res.status(500).send({ message: "มีบ่างอย่างผิดพลาด", status: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด", status: false });
  }
};

async function generatePublicUrl(res) {
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
  } catch (error) {
    console.log(error.message);
  }
}
