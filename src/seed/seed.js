const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // seed services
  await prisma.service.createMany({
    data: [
      {
        name: "Penyusunan UKL-UPL",
        slug: "ukl-upl",
        description:
          "Dokumen pengelolaan lingkungan untuk usaha kecil-menengah.",
        priceStart: 3000000,
        category: "dokumen",
        durationDays: 14,
      },
      {
        name: "Penyusunan AMDAL",
        slug: "amdal",
        description: "Analisis Mengenai Dampak Lingkungan untuk proyek besar.",
        priceStart: 15000000,
        category: "dokumen",
        durationDays: 45,
      },
    ],
  });

  // seed FAQ
  await prisma.fAQ.create({
    data: {
      serviceId: 1,
      question: "Apa itu UKL-UPL?",
      answer:
        "UKL-UPL adalah upaya pengelolaan dan pemantauan lingkungan untuk kegiatan non-AMDAL.",
    },
  });

  // seed admin (password = admin123)
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
