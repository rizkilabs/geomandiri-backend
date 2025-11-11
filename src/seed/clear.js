const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.chatLog.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.service.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.admin.deleteMany();

  console.log("🧹 All data cleared successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
