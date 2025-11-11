const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.controller");
const { isAdmin } = require("../middlewares/auth");

router.post("/register", ctrl.register); // for initial admin setup
router.post("/login", ctrl.login);
router.get("/profile", isAdmin, ctrl.profile);

module.exports = router;
