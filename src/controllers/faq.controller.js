const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const { serviceId } = req.query;
    const where = serviceId ? { serviceId: Number(serviceId) } : {};

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { id: "asc" },
      include: { service: { select: { name: true, slug: true } } },
    });

    res.json({ ok: true, data: faqs });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { serviceId, question, answer } = req.body;

    const newFaq = await prisma.fAQ.create({
      data: { serviceId: Number(serviceId), question, answer },
    });

    res.status(201).json({ ok: true, data: newFaq });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updated = await prisma.fAQ.update({
      where: { id: Number(id) },
      data: { question, answer },
    });

    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.fAQ.delete({ where: { id: Number(id) } });
    res.json({ ok: true, message: "FAQ deleted" });
  } catch (err) {
    next(err);
  }
};
