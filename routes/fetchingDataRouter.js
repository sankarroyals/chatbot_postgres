const express = require("express");
const fetchingDataController = require("../controllers/fetchingDataController");
const router = express.Router();

router.route("/").get(fetchingDataController.getData).post(fetchingDataController.addData);
router.route("/:id").patch(fetchingDataController.updateData).delete(fetchingDataController.deleteData);
module.exports = router;