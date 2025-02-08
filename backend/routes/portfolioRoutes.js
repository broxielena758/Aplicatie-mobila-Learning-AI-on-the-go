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
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files.file;
        const { user_id, course_id, type } = req.body;

        if (!user_id || !course_id || !type) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // ✅ Verificăm dacă `course_id` există în baza de date
        const courseCheck = await pool.query("SELECT id FROM courses WHERE id = $1", [course_id]);
        if (courseCheck.rows.length === 0) {
            return res.status(400).json({ error: `Course ID ${course_id} does not exist` });
        }

        // ✅ Definim directorul de upload pe baza tipului de fișier
        const folder = type === "assignment" ? "homework" : "personal_projects";
        const uploadDir = path.join(__dirname, `../uploads/${folder}`);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // ✅ Creăm un nume de fișier unic și mutăm fișierul
        const filePath = `/uploads/${folder}/${Date.now()}_${file.name}`;
        const fullPath = path.join(__dirname, `../${filePath}`);

        file.mv(fullPath, async (err) => {
            if (err) {
                console.error("File move error:", err);
                return res.status(500).json({ error: "File upload failed" });
            }

            // ✅ Inserăm detaliile fișierului în baza de date
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

        if (!user_id || user_id === "null") {
            console.error("❌ Received invalid user_id:", user_id);
            return res.status(400).json({ error: "Invalid user_id" });
        }

        const query = `
            SELECT submissions.*, courses.title AS course_title
            FROM submissions
            JOIN courses ON submissions.course_id = courses.id
            WHERE submissions.user_id = $1
            ORDER BY submissions.uploaded_at DESC;
        `;
        const { rows } = await pool.query(query, [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No submissions found" });
        }

        res.json(rows);
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// 📌 Endpoint pentru admin să vadă toate fișierele încărcate de utilizatori
router.get("/admin/submissions", async (req, res) => {
    try {
        const query = `
            SELECT submissions.*, users.first_name, users.last_name, courses.title AS course_title
            FROM submissions
            JOIN users ON submissions.user_id = users.id
            JOIN courses ON submissions.course_id = courses.id
            ORDER BY submissions.uploaded_at DESC;
        `;
        const { rows } = await pool.query(query);

        res.json(rows);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
