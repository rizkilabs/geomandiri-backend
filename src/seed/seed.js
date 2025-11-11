const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // Clear old data
  await prisma.fAQ.deleteMany();
  await prisma.service.deleteMany();
  await prisma.admin.deleteMany();

  // Insert Services
  await prisma.service.createMany({
    data: [
      {
        name: "Penyusunan UKL-UPL",
        slug: "ukl-upl",
        description:
          "Dokumen pengelolaan & pemantauan lingkungan untuk usaha dengan dampak moderat.",
        priceStart: 3000000,
        category: "dokumen",
        durationDays: 14,
      },
      {
        name: "Penyusunan AMDAL",
        slug: "amdal",
        description:
          "Kajian dampak lingkungan untuk usaha yang berdampak signifikan & butuh sidang komisi penilai.",
        priceStart: 15000000,
        category: "dokumen",
        durationDays: 45,
      },
      {
        name: "Penyusunan SPPL",
        slug: "sppl",
        description:
          "Surat Pernyataan Kesanggupan Pengelolaan dan Pemantauan Lingkungan untuk usaha skala kecil.",
        priceStart: 750000,
        category: "dokumen",
        durationDays: 3,
      },
    ],
  });

  // Get service IDs (this is the fix)
  const ukl = await prisma.service.findUnique({ where: { slug: "ukl-upl" } });
  const amdal = await prisma.service.findUnique({ where: { slug: "amdal" } });
  const sppl = await prisma.service.findUnique({ where: { slug: "sppl" } });

  // Insert FAQs with correct serviceId
  await prisma.fAQ.createMany({
    data: [
      // UKL UPL
      {
        serviceId: ukl.id,
        question: "Apa itu UKL-UPL?",
        answer:
          "Dokumen pengelolaan & pemantauan lingkungan sesuai peraturan berjalan.",
      },
      {
        serviceId: ukl.id,
        question: "Kapan usaha wajib memiliki UKL-UPL?",
        answer: "Jika kegiatan berdampak sedang dan tidak wajib AMDAL.",
      },
      {
        serviceId: ukl.id,
        question: "Berapa lama proses UKL-UPL?",
        answer: "Sekitar 7–14 hari tergantung kelengkapan data.",
      },

      // AMDAL
      {
        serviceId: amdal.id,
        question: "Apa itu AMDAL?",
        answer:
          "Kajian ilmiah untuk menilai dampak lingkungan dari suatu kegiatan.",
      },
      {
        serviceId: amdal.id,
        question: "Berapa lama proses AMDAL?",
        answer: "Bisa 30–60 hari karena ada sidang penilaian.",
      },

      // SPPL
      {
        serviceId: sppl.id,
        question: "Apa itu SPPL?",
        answer: "Surat kesanggupan mengelola lingkungan untuk usaha kecil.",
      },
      {
        serviceId: sppl.id,
        question: "Berapa lama proses SPPL?",
        answer: "Biasanya 1–3 hari saja.",
      },
    ],
  });

  // Seed Admin
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
