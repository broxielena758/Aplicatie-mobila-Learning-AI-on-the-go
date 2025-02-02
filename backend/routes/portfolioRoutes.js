const express = require("express");
const { uploadSubmission, getUserSubmissions, getAllSubmissions } = require("../controllers/portfolioController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadSubmission);
router.get("/user/:user_id", getUserSubmissions);
router.get("/admin/submissions", getAllSubmissions); // Admin route

module.exports = router;
