const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); 
const { ROLES } = require('../utils/constants'); 

// 1. Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Log 
        logger.info(`User registration attempt: ${email}`);

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            logger.warn(`Registration failed: User already exists - ${email}`);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || ROLES.PATIENT
        });
        
        await user.save();
        logger.success(`User registered successfully: ${email}`);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        logger.error("Registration Error", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info(`User login attempt: ${email}`);

        // Validate Email
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Login failed: Invalid email - ${email}`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: Invalid password - ${email}`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        logger.success(`User logged in: ${email}`);
        res.json({ token, role: user.role, name: user.name });
    } catch (error) {
        logger.error("Login Error", error);
        res.status(500).json({ error: error.message });
    }
};