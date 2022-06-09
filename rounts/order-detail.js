const router = require("express").Router();
const order_detail = require("../controllers/order-detail.controller");

router.post("/", order_detail.create);
router.get("/", order_detail.findAll);
router.get("/:id", order_detail.findOne);
router.delete("/:id", order_detail.delete);
router.get("/order_id/:id", order_detail.findOrderOne);
router.put("/:id", order_detail.update);
router.get("/cutarount_id/:id", order_detail.findCutArountOne);


module.exports = router;
