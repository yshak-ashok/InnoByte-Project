const User = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { sendConfirmationEmail } = require('../emailService');

// Register new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body; // Extract username, email, and password from request body
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12); // Hash the password with a salt rounds of 12
        const userData = await User.create({
            username,
            email,
            password: hashedPassword,
        }); // Create a new user in the database
        const payload = { email: userData.email };
        const confirmationCode = jwt.sign(payload, process.env.SECRET_CODE_KEY, { expiresIn: '5m' });
        sendConfirmationEmail(userData.username, userData.email, confirmationCode); // Send confirmation email with the generated token
        return res.status(200).json({ message: 'Registration successful & Confirmation email sent' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // Check if user exists and password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: '1hr' }); // Generate a JWT token for user authentication
        return res.status(200).json({ message: 'Login successful', token }); // Return success response with the token
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get user profile
const profile = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email }); // Find user by email in the database
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user }); // Return success response with user data
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

// Confirm user email
const confirmEmail = async (req, res) => {
    try {
        const { code } = req.query; // Extract confirmation code from request query
        // If no code, return an error response
        if (!code) {
            return res.status(401).json({ message: 'No confirmation code provided' });
        }
        let decoded;
        try {
            decoded = jwt.verify(code, process.env.SECRET_CODE_KEY); // Verify the confirmation code
        } catch (err) {
            // If code is invalid or expired, return an error response
            return res.status(403).json({ message: 'Link expired or invalid' });
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isConfirmed) {
            return res.status(409).json({ message: 'Email has already been confirmed.' }); // If email already confirmed, return an error response
        }
        user.isConfirmed = true; // Set user's email confirmation status to true
        await user.save();
        return res.status(200).json({ message: 'Email confirmation successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register, login, profile, confirmEmail };
