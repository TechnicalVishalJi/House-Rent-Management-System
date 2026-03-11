const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

const landlordOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "landlord" || req.user.role === "admin")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Landlords or Admins only." });
  }
};

module.exports = { adminOnly, landlordOrAdmin };
