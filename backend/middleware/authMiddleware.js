const jwt = require('jsonwebtoken');

// Middleware to verify JWT and attach user info to req.user
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token format' });

    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Malformed token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded should include id, email, age (if present)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { verifyToken };
