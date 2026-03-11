const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const Booking = require("../models/Booking");
const Property = require("../models/Property");

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { propertyId, startDate, endDate, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    if (!property.isAvailable)
      return res.status(400).json({ message: "Property is not available" });

    // Calculate total amount (months between dates * monthly price)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)),
    );
    const totalAmount = months * property.price;

    const booking = await Booking.create({
      tenant: req.user._id,
      property: propertyId,
      startDate,
      endDate,
      totalAmount,
      message,
    });

    const populated = await booking.populate([
      { path: "property", select: "title location price images" },
      { path: "tenant", select: "name email phone" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all bookings for logged in tenant
// @route   GET /api/bookings/my
// @access  Private
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id }).populate(
      "property",
      "title location price images",
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all bookings for a landlord's properties
// @route   GET /api/bookings/landlord
// @access  Private
router.get("/landlord", protect, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).select(
      "_id",
    );
    const propertyIds = properties.map((p) => p._id);
    const bookings = await Booking.find({
      property: { $in: propertyIds },
    }).populate([
      { path: "property", select: "title location price" },
      { path: "tenant", select: "name email phone" },
    ]);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate([
      { path: "property", select: "title location price images" },
      { path: "tenant", select: "name email phone" },
    ]);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update booking status (landlord or admin)
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put("/:id/status", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("property");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner =
      booking.property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isTenant = booking.tenant.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isTenant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin: Get all bookings
// @route   GET /api/bookings/admin/all
// @access  Private (admin)
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate([
      { path: "property", select: "title location price" },
      { path: "tenant", select: "name email" },
    ]);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Cancel a booking (tenant)
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      booking.tenant.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
