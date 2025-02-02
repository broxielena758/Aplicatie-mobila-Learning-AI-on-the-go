const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// 📌 Funcția REGISTER
const registerUser = async (req, res) => {
    const { first_name, last_name, dob, email, phone, password } = req.body;
    try {
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, dob, email, phone, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [first_name, last_name, dob, email, phone, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Funcția LOGIN


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(400).json({ message: "User not found" });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        // 📌 Log Date of Birth for Debugging
        console.log("User DOB from DB:", user.dob);

        // 📌 Calculate Age
        const age = calculateAge(user.dob);

        // 📌 Log Age for Debugging
        console.log("Calculated Age:", age);

        // ✅ Generate JWT Token with Age
        const token = jwt.sign({ id: user.id, email: user.email, age }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, age } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Correct Age Calculation Function
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--; // Adjust age if birthday hasn't happened yet this year
    }
    console.log(age);
    return age;
}



// 📌 Funcția GET PROFILE - Returnează datele utilizatorului logat
const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query("SELECT id, first_name, last_name, dob, email, phone FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser, getProfile };