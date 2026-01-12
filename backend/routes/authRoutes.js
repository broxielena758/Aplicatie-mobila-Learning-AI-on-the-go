const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

<<<<<<< HEAD
// Protected profile route — returns user data (id, first_name, last_name, dob, email, phone)
router.get('/profile', verifyToken, async (req, res) => {
    // authController.getProfile expects req.user.id to be set
    // Delegate to controller for consistency
    const { getProfile } = require('../controllers/authController');
    return getProfile(req, res);
});

=======
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
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