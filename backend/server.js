require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

// Import route files
const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();

// Enable CORS with proper settings
app.use(cors({
    origin: "*",  // Change this to your frontend URL in production
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Enable file uploads (Express-FileUpload middleware)
app.use(fileUpload());

// Body parser middleware (Handles JSON and URL-encoded data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
