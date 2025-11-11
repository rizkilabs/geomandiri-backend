const jwt = require("jsonwebtoken");

/**
 * Middleware to protect admin routes
 */
exports.isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};
