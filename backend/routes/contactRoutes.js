const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Conexiunea la PostgreSQL

// Salvarea unui mesaj în baza de date
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newMessage = await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
            [name, email, message]
        );
        res.status(201).json({ message: "Message sent successfully!", data: newMessage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

// Obține toate mesajele (Admin)
router.get('/messages', async (req, res) => {
    try {
        const messages = await pool.query("SELECT * FROM messages ORDER BY submitted_at DESC");
        res.json(messages.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
