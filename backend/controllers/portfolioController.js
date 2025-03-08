const pool = require("../config/db");

// 📌 Upload homework or project
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

// 📌 Fetch uploads for a specific user
const getUserSubmissions = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT submissions.*, courses.title AS course_title, submissions.grade, submissions.feedback
            FROM submissions
            JOIN courses ON submissions.course_id = courses.id
            WHERE submissions.user_id = $1
            ORDER BY submissions.uploaded_at DESC;
        `, [user_id]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Fetch all submissions (for admin access)
const getAllSubmissions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT submissions.*, users.first_name, users.last_name, courses.title AS course_title, submissions.grade, submissions.feedback
            FROM submissions
            JOIN users ON submissions.user_id = users.id
            JOIN courses ON submissions.course_id = courses.id
            ORDER BY submissions.uploaded_at DESC;
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Admin: Add grade to homework
const addGrade = async (req, res) => {
    const { submission_id } = req.params;
    const { grade } = req.body;

    if (!grade || grade < 1 || grade > 10) {
        return res.status(400).json({ error: "Grade must be between 1 and 10" });
    }

    try {
        await pool.query("UPDATE submissions SET grade = $1 WHERE id = $2 AND type = 'assignment'", [grade, submission_id]);
        res.json({ message: "Grade updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Admin: Add feedback to personal projects
const addFeedback = async (req, res) => {
    const { submission_id } = req.params;
    const { feedback } = req.body;

    if (!feedback || feedback.length < 5) {
        return res.status(400).json({ error: "Feedback must be at least 5 characters long" });
    }

    try {
        await pool.query("UPDATE submissions SET feedback = $1 WHERE id = $2 AND type = 'project'", [feedback, submission_id]);
        res.json({ message: "Feedback added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    uploadSubmission, 
    getUserSubmissions, 
    getAllSubmissions, 
    addGrade, 
    addFeedback 
};
