const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chatbot.controller");

router.post("/", ctrl.chat);

module.exports = router;
