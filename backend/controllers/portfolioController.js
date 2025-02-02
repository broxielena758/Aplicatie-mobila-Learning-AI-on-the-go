const pool = require("../config/db");

// Upload homework or project
const uploadSubmission = async (req, res) => {
    const { user_id, course_id, type } = req.body;
    const file_path = req.file ? req.file.path : null;

    if (!file_path) {
        return res.status(400).json({ error: "File upload failed" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO submissions (user_id, course_id, file_path, type) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, course_id, file_path, type]
        );
        res.status(201).json({ message: "File uploaded successfully!", submission: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch uploads for a specific user
const getUserSubmissions = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM submissions WHERE user_id = $1", [user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch all submissions (for admin access)
const getAllSubmissions = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM submissions");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadSubmission, getUserSubmissions, getAllSubmissions };
