const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    // 1. Authorization header එකෙන් token එක ගන්නවා
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Token verify කරනවා
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. req.user attach කරනවා
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};