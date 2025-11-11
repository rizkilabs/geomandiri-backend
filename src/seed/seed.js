const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  await prisma.fAQ.deleteMany();
  await prisma.service.deleteMany();
  await prisma.admin.deleteMany();

  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Penyusunan UKL-UPL",
        slug: "ukl-upl",
        description:
          "Dokumen pengelolaan lingkungan untuk usaha kecil-menengah.",
        priceStart: 3000000,
        category: "dokumen",
        durationDays: 14,
      },
    }),
    prisma.service.create({
      data: {
        name: "Penyusunan AMDAL",
        slug: "amdal",
        description: "Analisis Mengenai Dampak Lingkungan untuk proyek besar.",
        priceStart: 15000000,
        category: "dokumen",
        durationDays: 45,
      },
    }),
  ]);

  // Seed FAQ (pakai id hasil insert service)
  await prisma.fAQ.create({
    data: {
      serviceId: services[0].id,
      question: "Apa itu UKL-UPL?",
      answer:
        "UKL-UPL adalah upaya pengelolaan dan pemantauan lingkungan untuk kegiatan non-AMDAL.",
    },
  });

  // Seed admin
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: {
      username: "admin",
      password: hash,
    },
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
