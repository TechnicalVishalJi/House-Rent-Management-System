const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly, landlordOrAdmin } = require("../middleware/adminMiddleware");
const multer = require("multer");
const path = require("path");
const Property = require("../models/Property");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// @desc    Get all approved properties (with optional filters)
// @route   GET /api/properties
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, search } = req.query;
    let query = { status: "approved", isAvailable: true };

    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(query).populate(
      "owner",
      "name email phone",
    );
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone",
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (landlord or admin)
router.post(
  "/",
  protect,
  landlordOrAdmin,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        address,
        city,
        state,
        price,
        bedrooms,
        bathrooms,
        area,
        amenities,
      } = req.body;
      const images = req.files
        ? req.files.map((f) => `/uploads/${f.filename}`)
        : [];

      const property = await Property.create({
        title,
        description,
        type,
        location: { address, city, state },
        price,
        bedrooms,
        bathrooms,
        area,
        amenities: amenities ? amenities.split(",").map((a) => a.trim()) : [],
        images,
        owner: req.user._id,
      });

      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner or admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    // Only owner or admin can update
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (owner or admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin: Get all properties (any status)
// @route   GET /api/properties/admin/all
// @access  Private (admin only)
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const properties = await Property.find({}).populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin: Approve or reject property
// @route   PUT /api/properties/admin/:id/status
// @access  Private (admin only)
router.put("/admin/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    property.status = req.body.status; // 'approved' or 'rejected'
    await property.save();
    res.json({ message: `Property ${property.status}`, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get properties owned by logged-in landlord
// @route   GET /api/properties/my/listings
// @access  Private
router.get("/my/listings", protect, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
