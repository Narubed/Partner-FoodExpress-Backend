const router = require("express").Router();
const order = require("../controllers/order.controllre");

router.post("/", order.create);
router.get("/", order.findAll);
router.get("/:id", order.findOne);
router.put("/:id", order.update);
router.delete("/:id", order.delete);
router.get("/partner_id/:id", order.findPartnerOne);

module.exports = router;
