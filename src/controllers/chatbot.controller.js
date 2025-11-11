require("dotenv").config();
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Pastikan variabel lingkungan ini sudah disetel dengan benar di file .env Anda
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/chatbot";

exports.chat = async (req, res, next) => {
  try {
    const { sessionId, message, serviceSlug } = req.body;

    // Validasi input
    if (!message)
      return res.status(400).json({ ok: false, message: "Message required" });

    // Tentukan ID Sesi, gunakan timestamp jika tidak ada
    const sender = sessionId || `s${Date.now()}`;

    const payload = { message, serviceSlug, sessionId: sender };

    // --- 1. Kirim pesan ke n8n webhook ---
    const n8nRes = await axios.post(N8N_WEBHOOK_URL, payload, {
      // Timeout 15 detik
      timeout: 15000,
    });

    // --- 2. Penanganan Data Respons (Perbaikan Utama) ---
    const n8nData = n8nRes.data;
    let botReply;

    if (Array.isArray(n8nData) && n8nData.length > 0 && n8nData[0].reply) {
      // Kasus 1: n8n mengembalikan array dengan objek { reply: ... }
      botReply = n8nData[0].reply;
    } else if (n8nData && n8nData.reply) {
      // Kasus 2: n8n mengembalikan objek tunggal { reply: ... }
      botReply = n8nData.reply;
    }

    // Fallback jika tidak ada balasan yang ditemukan
    botReply = botReply || "Maaf, belum ada respon dari bot.";

    // --- 3. Simpan chat ke DB ---
    await prisma.chatLog.create({
      data: {
        sessionId: sender,
        userMessage: message,
        botReply,
      },
    });

    // --- 4. Kirim Balasan ke Klien ---
    res.json({ ok: true, reply: botReply });
  } catch (err) {
    // Menampilkan error detail di konsol untuk debugging
    console.error("Chatbot error:", err.message);

    // Memberi tahu klien bahwa ada error internal
    res.status(500).json({ ok: false, message: "Chatbot internal error" });
  }
};
