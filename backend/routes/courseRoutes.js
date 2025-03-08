const express = require("express");
const router = express.Router();

// Simulare cursuri (înlocuiește cu date din PostgreSQL mai târziu)
const courses = [
    { id: 1, title: "Introduction to Microsoft Designer", category: "photography", age_group: "under14" },
    { id: 2, title: "Create your own graphic designs", category: "photography", age_group: "under14" },
    { id: 3, title: "Create more advanced projects", category: "photography", age_group: "under14" },
    { id: 4, title: "Introduction to Mentimeter", category: "learning", age_group: "under14" },
    { id: 5, title: "School Project Presentation", category: "learning", age_group: "under14" },
    { id: 6, title: "Test-quiz Presentation", category: "learning", age_group: "under14" },
    { id: 7, title: "Introduction to CapCut", category: "photography", age_group: "over14" },
    { id: 8, title: "Photo-editing", category: "photography", age_group: "over14" },
    { id: 9, title: "Video-editing", category: "photography", age_group: "over14" },
    { id: 10, title: "Introduction to ChatGPT: Interview Questions", category: "learning", age_group: "over14" },
    { id: 11, title: "Prepare for an University Interview", category: "learning", age_group: "over14" },
    { id: 12, title: "Prepare for a Job Interview", category: "learning", age_group: "over14" }
];

// Endpoint pentru a obține lista cursurilor
router.get("/", (req, res) => {
    res.json(courses);
});

module.exports = router;
