import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  try {
    // coba connect ke database
    await prisma.$connect();
    console.log("✅ Prisma connected successfully!");

    // coba ambil daftar tabel (tanpa query tabel tertentu)
    const tables = await prisma.$queryRawUnsafe(`SHOW TABLES;`);
    console.log("📋 Tables in DB:", tables);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
