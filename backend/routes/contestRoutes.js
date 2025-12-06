const express = require("express");
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Ensure the uploads directory exists
const contestUploadFolder = path.join(__dirname, "../uploads/contest_entries");
if (!fs.existsSync(contestUploadFolder)) {
    fs.mkdirSync(contestUploadFolder, { recursive: true });
}

// 📌 Get Contests Based on User Age
router.get("/available/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // Get user's age
        const user = await pool.query("SELECT dob FROM users WHERE id = $1", [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const dob = new Date(user.rows[0].dob);
        const age = calculateAge(dob);
        const ageGroup = age < 14 ? "under14" : "over14";

        // Fetch contests for user's group
        const contests = await pool.query(
            "SELECT * FROM contests WHERE age_group = $1 ORDER BY deadline ASC",
            [ageGroup]
        );

        res.json(contests.rows);
    } catch (error) {
        console.error("Contest fetch error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

function calculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// 📌 Submit a Contest Entry
router.post("/submit", async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files.file;
        const { user_id, contest_id } = req.body;

        if (!user_id || !contest_id) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Ensure contest exists
        const contestCheck = await pool.query("SELECT * FROM contests WHERE id = $1", [contest_id]);
        if (contestCheck.rows.length === 0) {
            return res.status(400).json({ error: `Contest ID ${contest_id} does not exist` });
        }

        // Prevent duplicate submission
        const existingEntry = await pool.query(
            "SELECT * FROM contest_entries WHERE user_id = $1 AND contest_id = $2",
            [user_id, contest_id]
        );
        if (existingEntry.rows.length > 0) {
            return res.status(400).json({ error: "You have already submitted an entry for this contest." });
        }

        // Save file
        const filePath = `/uploads/contest_entries/${Date.now()}_${file.name}`;
        const fullPath = path.join(__dirname, "..", "uploads", "contest_entries", `${Date.now()}_${file.name}`);
        file.mv(fullPath, async (err) => {
            if (err) {
                console.error("File move error:", err);
                return res.status(500).json({ error: "File upload failed" });
            }

            // Insert entry into database
            await pool.query(
                "INSERT INTO contest_entries (contest_id, user_id, file_path) VALUES ($1, $2, $3)",
                [contest_id, user_id, filePath]
            );

            res.json({ message: "Submission successful!", filePath });
        });
    } catch (error) {
        console.error("Error submitting contest entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Submit a Contest Quiz Result (age-based quizzes progress)
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/quiz-submit', verifyToken, async (req, res) => {
    try {
        const { user_id, contest_id, score, total, percentage, prize } = req.body;

        // Basic validation
        if (!contest_id || score == null || total == null) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure the authenticated user matches the provided user_id (if provided)
        const authUserId = req.user && (req.user.id || req.user.user_id || req.user.sub);
        if (user_id && authUserId && String(user_id) !== String(authUserId)) {
            return res.status(403).json({ error: 'User id mismatch' });
        }

        const insertUserId = user_id || authUserId;
        if (!insertUserId) return res.status(400).json({ error: 'User ID not provided or available' });

        // Optional: ensure contest exists
        const contestCheck = await pool.query('SELECT id FROM contests WHERE id = $1', [contest_id]);
        if (contestCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Contest not found' });
        }

        await pool.query(
            `INSERT INTO contest_quiz_results (user_id, contest_id, score, total, percentage, prize)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [insertUserId, contest_id, score, total, percentage || null, prize || null]
        );

        res.json({ message: 'Quiz result saved' });
    } catch (error) {
        console.error('Error saving contest quiz result:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 📌 Grade a Contest Entry
router.post("/grade/:entry_id", async (req, res) => {
    const { entry_id } = req.params;
    const { grade, feedback } = req.body;

    if (!grade || grade < 1 || grade > 10) {
        return res.status(400).json({ error: "Grade must be between 1 and 10" });
    }

    try {
        await pool.query("UPDATE contest_entries SET grade = $1, feedback = $2 WHERE id = $3", [grade, feedback, entry_id]);
        res.json({ message: "Grade and feedback submitted successfully" });
    } catch (error) {
        console.error("Error updating grade:", error);
        res.status(500).json({ error: "Error updating grade" });
    }
});

// 📌 Declare Winners
router.get("/winners/:contest_id", async (req, res) => {
    try {
        const { contest_id } = req.params;

        const winner = await pool.query(
            "SELECT * FROM contest_entries WHERE contest_id = $1 ORDER BY grade DESC LIMIT 1",
            [contest_id]
        );

        if (winner.rows.length === 0) {
            return res.json({ message: "No entries graded yet." });
        }

        res.json({ winner: winner.rows[0] });
    } catch (error) {
        console.error("Error fetching winner:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/admin/submissions", async (req, res) => {
    try {
        const entries = await pool.query(`
            SELECT ce.*, u.first_name, u.last_name, c.title AS contest_title
            FROM contest_entries ce
            JOIN users u ON ce.user_id = u.id
            JOIN contests c ON ce.contest_id = c.id
            ORDER BY ce.submitted_at DESC
        `);
        res.json(entries.rows);
    } catch (error) {
        console.error("Error fetching admin contest entries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

// 📌 Delete a contest entry (owner only)
router.delete('/entries/:entry_id', verifyToken, async (req, res) => {
    const { entry_id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM contest_entries WHERE id = $1', [entry_id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Contest entry not found' });

        const entry = rows[0];
        if (String(entry.user_id) !== String(req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to delete this entry' });
        }

        // Remove file if exists
        try {
            const filePath = entry.file_path || '';
            const storagePath = path.join(__dirname, '..', filePath.replace(/^\/+/, ''));
            if (fs.existsSync(storagePath)) {
                await fs.promises.unlink(storagePath);
            }
        } catch (err) {
            console.warn('Could not remove contest entry file:', err.message || err);
        }

        await pool.query('DELETE FROM contest_entries WHERE id = $1', [entry_id]);
        res.json({ message: 'Contest entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting contest entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
