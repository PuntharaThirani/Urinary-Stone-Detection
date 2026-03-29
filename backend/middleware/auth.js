const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Header එකෙන් Token එක ගන්නවා
    const token = req.header('x-auth-token');

    // 2. Token එකක් නැත්නම් එලවනවා
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Token එක හරිද කියලා බලනවා
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // User විස්තර Request එකට අමුණනවා
        next(); // ඊළඟ පියවරට යන්න දෙනවා
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};