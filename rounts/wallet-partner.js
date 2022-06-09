const router = require("express").Router();
const wallet_partner = require("../controllers/wallet-partner/wallet-partner.controller");
const wallet_partner_report = require("../controllers/wallet-partner/wallet-partner-report.controller");

router.post("/wallet_partner_report/", wallet_partner_report.create);
router.get("/wallet_partner_report/", wallet_partner_report.findAllR);
router.get("/wallet_partner_report/:id", wallet_partner_report.findOne);
router.delete("/wallet_partner_report:id", wallet_partner_report.delete);
router.put("/wallet_partner_report_slip/:id", wallet_partner_report.updateSlip);

router.post("/", wallet_partner.create);
router.get("/", wallet_partner.findAll);
router.get("/:id", wallet_partner.findOne);
router.get("/partner_id/:id", wallet_partner.findOnePartner);
router.delete("/:id", wallet_partner.delete);
router.put("/:id", wallet_partner.update);




module.exports = router;
