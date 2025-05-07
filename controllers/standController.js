const mongoose = require("mongoose");
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

// Create stand
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

// Update stand
const updateStand = async (req, res) => {
  const { id } = req.params;
  const {
    standName,
    isFull, // optional manual override
    isActive,
    maxCapacity,
    productSpacing,
    action,
    productId, // This will be used to add or remove products
    productIds, // This will be used to replace the whole list of productIds
  } = req.body;

  try {
    const stand = await Stand.findOne({ standID: id });
    if (!stand) return res.status(404).json({ message: "Stand not found" });

    // Update general fields
    if (standName !== undefined) stand.standName = standName;
    if (isActive !== undefined) stand.isActive = isActive;
    if (maxCapacity !== undefined) {
      if (maxCapacity < 1)
        return res.status(400).json({ message: "maxCapacity must be >= 1" });
      stand.maxCapacity = maxCapacity;
    }
    if (productSpacing !== undefined) {
      if (productSpacing < 0)
        return res
          .status(400)
          .json({ message: "productSpacing can't be negative" });
      stand.productSpacing = productSpacing;
    }

    // Manage productIds
    let updated = false;

    if (action === "add") {
      if (!productId)
        return res.status(400).json({ message: "Missing productId to add" });
      if (!stand.productIds.includes(productId)) {
        stand.productIds.push(productId); // Add the new productId
        updated = true;
      }
    } else if (action === "remove") {
      if (!productId)
        return res.status(400).json({ message: "Missing productId to remove" });
      const initialLength = stand.productIds.length;
      stand.productIds = stand.productIds.filter(
        (id) => id.toString() !== productId
      );
      if (stand.productIds.length !== initialLength) updated = true;
    } else if (action === "replace") {
      if (!Array.isArray(productIds))
        return res.status(400).json({ message: "productIds must be an array" });
      stand.productIds = productIds; // Replace with a new array of productIds
      updated = true;
    }

    // Update isFull based on product count vs maxCapacity
    if (updated || maxCapacity !== undefined) {
      const currentCount = stand.productIds.length;
      stand.isFull =
        stand.maxCapacity !== undefined && currentCount >= stand.maxCapacity;
    }

    // Optional override if user sent isFull directly
    if (isFull !== undefined) stand.isFull = isFull;

    await stand.save();

    res.status(200).json({
      message: "Stand updated",
      isFullStatus: stand.isFull,
      currentCount: stand.productIds.length,
      stand,
    });
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
