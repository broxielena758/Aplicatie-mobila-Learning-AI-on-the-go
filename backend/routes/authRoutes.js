const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Admin login route
router.post('/admin-login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = "admin123"; // Change this to your desired admin password

    if (password === ADMIN_PASSWORD) {
        const adminToken = "admin_authenticated_" + Date.now();
        res.json({ success: true, token: adminToken });
    } else {
        res.status(401).json({ message: "Invalid admin password" });
    }
});

module.exports = router;