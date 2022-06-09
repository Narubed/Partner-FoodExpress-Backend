const router = require("express").Router();
const CutArountOrder = require("../controllers/cut-arount-order.controller");

router.post("/", CutArountOrder.create);
router.get("/", CutArountOrder.findAll);
router.get("/:id", CutArountOrder.findOne);


module.exports = router;
