const express = require("express");
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// 📌 Ensure required directories exist
const uploadFolder = path.join(__dirname, "../uploads");
const folders = ["homework", "personal_projects"];

// Create upload directories if they don't exist
folders.forEach(folder => {
    const folderPath = path.join(uploadFolder, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
});

// 📌 Upload File (Homework or Project)
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

        // Validate course existence
        const courseCheck = await pool.query("SELECT id FROM courses WHERE id = $1", [course_id]);
        if (courseCheck.rows.length === 0) {
            return res.status(400).json({ error: `Invalid Course ID: ${course_id}` });
        }

        // Determine folder for storage
        const folder = type === "assignment" ? "homework" : "personal_projects";
        const filePath = `/uploads/${folder}/${Date.now()}_${file.name}`;
        const fullPath = path.join(__dirname, `../${filePath}`);

        // Move file to storage location
        file.mv(fullPath, async (err) => {
            if (err) {
                console.error("File move error:", err);
                return res.status(500).json({ error: "File upload failed" });
            }

            // Save file metadata to database
            await pool.query(
                `INSERT INTO submissions (user_id, course_id, file_path, type)
                 VALUES ($1, $2, $3, $4) RETURNING *;`,
                [user_id, course_id, filePath, type]
            );

            res.json({ message: "File uploaded successfully!", filePath });
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Fetch User Submissions
router.get("/user/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const query = `
            SELECT submissions.*, courses.title AS course_title
            FROM submissions
            JOIN courses ON submissions.course_id = courses.id
            WHERE user_id = $1 ORDER BY uploaded_at DESC`;
        const { rows } = await pool.query(query, [user_id]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching user submissions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Fetch All Submissions (Admin)
router.get("/admin/submissions", async (req, res) => {
    try {
        const query = `
            SELECT submissions.*, users.first_name, users.last_name, courses.title AS course_title
            FROM submissions
            JOIN users ON submissions.user_id = users.id
            JOIN courses ON submissions.course_id = courses.id
            ORDER BY submissions.uploaded_at DESC`;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching admin submissions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Admin - Grade Homework
router.post("/grade/:submissionId", async (req, res) => {
    const { submissionId } = req.params;
    const { grade } = req.body;

    if (!grade || grade < 1 || grade > 10) {
        return res.status(400).json({ error: "Grade must be between 1 and 10" });
    }

    try {
        await pool.query("UPDATE submissions SET grade = $1 WHERE id = $2", [grade, submissionId]);
        res.json({ message: "Grade added successfully" });
    } catch (error) {
        console.error("Error updating grade:", error);
        res.status(500).json({ error: "Error updating grade" });
    }
});

// 📌 Admin - Add Feedback to Projects
router.post("/feedback/:submissionId", async (req, res) => {
    const { submissionId } = req.params;
    const { feedback } = req.body;

    if (!feedback || feedback.length < 5) {
        return res.status(400).json({ error: "Feedback must be at least 5 characters long" });
    }

    try {
        const query = `UPDATE submissions SET feedback = $1 WHERE id = $2 RETURNING *;`;
        const values = [feedback, submissionId];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json({ message: "Feedback added successfully!", updatedSubmission: result.rows[0] });
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

// 📌 Delete a submission (owner only)
router.delete('/submissions/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM submissions WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });

        const submission = rows[0];
        // Only owner can delete their submission
        if (String(submission.user_id) !== String(req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to delete this submission' });
        }

        // Remove file from disk if exists
        try {
            const filePath = submission.file_path || '';
            const storagePath = path.join(__dirname, '..', filePath.replace(/^\/+/, ''));
            if (fs.existsSync(storagePath)) {
                fs.unlinkSync(storagePath);
            }
        } catch (err) {
            console.warn('Could not remove file for submission:', err.message || err);
        }

        const deleted = await pool.query('DELETE FROM submissions WHERE id = $1 RETURNING *', [id]);
        res.json({ message: 'Submission deleted successfully', deleted: deleted.rows[0] });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
