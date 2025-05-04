const express = require("express");
const router = express.Router();
const {
  updateStandStatus,
  createStand,
} = require("../controllers/standController");

// POST /api/stands
router.post("/", createStand);
// PATCH /api/stands/:id
router.patch("/:id", updateStandStatus);

module.exports = router;
