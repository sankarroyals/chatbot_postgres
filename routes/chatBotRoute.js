const express = require("express");
const chatBotController = require("../controllers/chatBotController");
const router = express.Router();

router.route("/").post(chatBotController.talk);


module.exports = router;