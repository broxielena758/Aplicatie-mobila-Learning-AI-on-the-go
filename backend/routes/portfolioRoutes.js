const express = require("express");
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Asigură-te că ai folderele `uploads/homework` și `uploads/personal_projects`
const uploadFolder = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}
if (!fs.existsSync(`${uploadFolder}/homework`)) {
    fs.mkdirSync(`${uploadFolder}/homework`, { recursive: true });
}
if (!fs.existsSync(`${uploadFolder}/personal_projects`)) {
    fs.mkdirSync(`${uploadFolder}/personal_projects`, { recursive: true });
}

// 📌 Endpoint pentru upload fișiere
router.post("/upload", async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files.file;
        const { user_id, course_id, type } = req.body;

        // Validate required parameters
        if (!user_id || !course_id || !type) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Define upload folder
        const folder = type === "assignment" ? "homework" : "personal_projects";
        const uploadDir = path.join(__dirname, `../uploads/${folder}`);

        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Define file path
        const filePath = `/uploads/${folder}/${Date.now()}_${file.name}`;
        const fullPath = path.join(__dirname, `../${filePath}`);

        // Move the file to the correct directory
        file.mv(fullPath, async (err) => {
            if (err) {
                console.error("File move error:", err);
                return res.status(500).json({ error: "File upload failed" });
            }

            // Insert into database
            const query = `
                INSERT INTO submissions (user_id, course_id, file_path, type)
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const values = [user_id, course_id, filePath, type];

            await pool.query(query, values);
            res.json({ message: "File uploaded successfully!", filePath });
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Endpoint pentru a obține fișierele unui utilizator
router.get("/user/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        const query = `SELECT * FROM submissions WHERE user_id = $1`;
        const { rows } = await pool.query(query, [user_id]);

        res.json(rows);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Endpoint pentru admin să vadă toate fișierele
router.get("/admin/submissions", async (req, res) => {
    try {
        const query = `SELECT * FROM submissions`;
        const { rows } = await pool.query(query);

        res.json(rows);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
