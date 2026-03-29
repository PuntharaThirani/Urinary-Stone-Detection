const { check, validationResult } = require('express-validator');

// 1. Validation Rules හදනවා
exports.registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

// 2. Validation Check කරන Function එක
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // වැරදි තියෙනවා නම් කෙලින්ම Error එක යවනවා
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // වැරදි නැත්නම් ඉස්සරහට යවනවා
};