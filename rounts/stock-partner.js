const router = require("express").Router();
const stock_partner = require("../controllers/stock-partner/stock-partner.controller");
const stock_partner_report = require("../controllers/stock-partner/stock-partner-report.controller");

router.post("/stock_partner_report/", stock_partner_report.create);
router.get("/stock_partner_report/", stock_partner_report.findAll);
router.get("/stock_partner_report/:id", stock_partner_report.findOne);
router.get("/stock_partner_report/partner_id/:id", stock_partner_report.findOnePartner);
router.delete("/stock_partner_report/:id", stock_partner_report.delete);
router.put("/stock_partner_report/:id", stock_partner_report.update);

router.post("/", stock_partner.create);
router.get("/", stock_partner.findAll);
router.get("/:id", stock_partner.findOne);
router.get("/partner_id/:id", stock_partner.findOnePartner);
router.delete("/:id", stock_partner.delete);
router.put("/:id", stock_partner.update);




module.exports = router;
