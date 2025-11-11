const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * POST /api/auth/register
 * body: { username, password }
 * Only for initial setup or superadmin usage later.
 */
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ ok: false, message: "Username and password required" });

    const exists = await prisma.admin.findUnique({ where: { username } });
    if (exists)
      return res
        .status(400)
        .json({ ok: false, message: "Username already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.admin.create({
      data: { username, password: hash },
    });

    res.status(201).json({
      ok: true,
      message: "Admin registered successfully",
      data: { id: user.id, username: user.username },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * body: { username, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ ok: false, message: "Username and password required" });

    const user = await prisma.admin.findUnique({ where: { username } });
    if (!user)
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWTSECRET,
      { expiresIn: "8h" }
    );

    res.json({
      ok: true,
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/profile
 * Protected route (requires token)
 */
exports.profile = async (req, res, next) => {
  try {
    res.json({ ok: true, user: req.user });
  } catch (err) {
    next(err);
  }
};
