const express = require("express");
const router = express.Router();

// Simulare cursuri (înlocuiește cu date din PostgreSQL mai târziu)
const courses = [
    { id: 1, title: "Photography Basics", category: "photography", age_group: "over14" },
    { id: 2, title: "Advanced Photography", category: "photography", age_group: "under14" },
    { id: 3, title: "AI Learning", category: "learning", age_group: "over14" }
];

// Endpoint pentru a obține lista cursurilor
router.get("/", (req, res) => {
    res.json(courses);
});

module.exports = router;
