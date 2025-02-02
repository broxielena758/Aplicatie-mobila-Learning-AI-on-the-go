const pool = require("../config/db");

const createSubmissionTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            course_id INT REFERENCES courses(id) ON DELETE CASCADE,
            file_path TEXT NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('assignment', 'project')),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("📂 Submission table is ready!");
};

createSubmissionTable();

module.exports = pool;
