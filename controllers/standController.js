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
    const stand = await Stand.findById(id);
    if (!stand) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json(stand);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stand", error });
  }
};

// Create stand
const createStand = async (req, res) => {
  const {
    standName,
    isFull = false,
    isActive = true,
    productIds = [],
  } = req.body;
  try {
    const newStand = await Stand.create({
      standName,
      isFull,
      isActive,
      productIds,
      currentProductCount: productIds.length, // ✅ يتم تعيينه بناءً على عدد المنتجات المضافة
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
    isFull,
    isActive,
    maxCapacity,
    productSpacing,
    currentProductCount,
    productIds,
    action,
    productId,
  } = req.body;

  try {
    const stand = await Stand.findById(id);
    if (!stand) return res.status(404).json({ message: "Stand not found" });

    // ✅ تحديث مباشر للحقول البسيطة
    if (standName !== undefined) stand.standName = standName;
    if (isActive !== undefined) stand.isActive = isActive;
    if (isFull !== undefined) stand.isFull = isFull;
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
    if (currentProductCount !== undefined) {
      if (currentProductCount < 0)
        return res
          .status(400)
          .json({ message: "currentProductCount can't be negative" });
      stand.currentProductCount = currentProductCount;
    }

    // ✅ تعديل productIds (add/remove/replace)
    let updated = false;
    if (action === "add") {
      if (!productId)
        return res.status(400).json({ message: "Missing productId to add" });
      if (!stand.productIds.includes(productId)) {
        stand.productIds.push(productId);
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
      stand.productIds = productIds;
      updated = true;
    }

    // ✅ إذا تم تعديل المنتجات نحسب currentProductCount تلقائياً (ولو ما تمش تحديده يدوي)
    if (updated && currentProductCount === undefined) {
      stand.currentProductCount = stand.productIds.length;
    }

    // ✅ تحديث isFull تلقائي إذا maxCapacity أو عدد المنتجات تغيّروا
    if (
      (updated || maxCapacity !== undefined) &&
      currentProductCount === undefined
    ) {
      const count = stand.productIds.length;
      stand.isFull =
        stand.maxCapacity !== undefined && count >= stand.maxCapacity;
    }

    await stand.save();

    res.status(200).json({
      message: "Stand updated",
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
    const deleted = await Stand.findByIdAndDelete(id);
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
