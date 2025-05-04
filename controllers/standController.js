const Stand = require("../models/Stands");

// Get all stands
const getAllStands = async (req, res) => {
  try {
    const stands = await Stand.find();
    res.status(200).json(stands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stands", error });
  }
};

// Get stand by ID
const getStandById = async (req, res) => {
  const { id } = req.params;
  try {
    const stand = await Stand.findOne({ standID: id });
    if (!stand) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json(stand);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stand", error });
  }
};

// create stand
const createStand = async (req, res) => {
  const { standID, standName, isFull = false, isActive = true } = req.body;

  try {
    // Check if stand already exists
    const existingStand = await Stand.findOne({ standID });
    if (existingStand) {
      return res.status(400).json({ message: "Stand already exists" });
    }

    const newStand = await Stand.create({
      standID,
      standName,
      isFull,
      isActive,
    });

    res.status(201).json({ message: "Stand created", stand: newStand });
  } catch (error) {
    res.status(500).json({ message: "Error creating stand", error });
  }
};

// Update isFull or isActive
const updateStand = async (req, res) => {
  const { id } = req.params;
  const { isFull, isActive } = req.body;

  try {
    const stand = await Stand.findOneAndUpdate(
      { standID: id },
      {
        ...(isFull !== undefined && { isFull }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );
    if (!stand) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json({ message: "Stand updated", stand });
  } catch (error) {
    res.status(500).json({ message: "Error updating stand", error });
  }
};

// Delete stand
const deleteStand = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Stand.findOneAndDelete({ standID: id });
    if (!deleted) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json({ message: "Stand deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stand", error });
  }
};

module.exports = {
  getAllStands,
  getStandById,
  createStand,
  updateStand,
  deleteStand,
};
