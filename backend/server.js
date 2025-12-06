require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

// ✅ Route imports
const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const contactRoutes = require("./routes/contactRoutes");
const contestRoutes = require("./routes/contestRoutes");

// ✅ Middleware
app.use(cors({
    origin: "*",  // In production, replace with your frontend domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Serve static PHP-related frontend (for example stats interface)
app.use("/statistics", express.static(path.join(__dirname, "statistics")));
// ⬆️ This makes http://localhost:5000/statistics/index.php work like static frontend file

// ✅ Route use
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api", contactRoutes);
app.use("/api/contest", contestRoutes); // <-- Now this will work

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 PHP stats interface at http://localhost:8000 (run it separately with: php -S localhost:8000)`);
});
