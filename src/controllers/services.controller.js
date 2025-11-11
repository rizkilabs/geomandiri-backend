const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        skip,
        take: limit,
        include: { faqs: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.service.count(),
    ]);

    res.json({
      ok: true,
      data: services,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findUnique({
      where: { slug },
      include: { faqs: true },
    });
    if (!service)
      return res.status(404).json({ ok: false, message: "Service not found" });
    res.json({ ok: true, data: service });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, slug, description, priceStart, category, durationDays } =
      req.body;

    const exists = await prisma.service.findUnique({ where: { slug } });
    if (exists)
      return res
        .status(400)
        .json({ ok: false, message: "Slug already exists" });

    const newService = await prisma.service.create({
      data: { name, slug, description, priceStart, category, durationDays },
    });

    res.status(201).json({ ok: true, data: newService });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, priceStart, category, durationDays } =
      req.body;

    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: { name, slug, description, priceStart, category, durationDays },
    });

    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.fAQ.deleteMany({ where: { serviceId: Number(id) } }); // remove child
    await prisma.service.delete({ where: { id: Number(id) } });

    res.json({ ok: true, message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};
