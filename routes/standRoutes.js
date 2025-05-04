const express = require("express");
const router = express.Router();
const {
  getAllStands,
  getStandById,
  createStand,
  updateStand,
  deleteStand,
} = require("../controllers/standController");

router.get("/", getAllStands);
router.get("/:id", getStandById);
router.post("/", createStand);
router.patch("/:id", updateStand);
router.delete("/:id", deleteStand);

module.exports = router;
