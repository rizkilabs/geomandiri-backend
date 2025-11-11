const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/faq.controller");
const auth = require("../middlewares/auth");

router.get("/", ctrl.getAll);

router.post("/", auth.isAdmin, ctrl.create);
router.put("/:id", auth.isAdmin, ctrl.update);
router.delete("/:id", auth.isAdmin, ctrl.remove);

module.exports = router;
