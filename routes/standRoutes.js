const express = require("express");
const router = express.Router();
const { updateStand, createStand } = require("../controllers/standController");

// POST /api/stands
router.post("/", createStand);
// PATCH /api/stands/:id
router.patch("/:id", updateStand);

module.exports = router;
