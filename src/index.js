require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const servicesRoutes = require("./routes/services.routes");
const faqRoutes = require("./routes/faq.routes");
const authRoutes = require("./routes/auth.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/services", servicesRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
