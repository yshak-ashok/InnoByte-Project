const User = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { sendConfirmationEmail } = require('../emailService');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const userData = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        const payload = { email: userData.email };
        const confirmationCode = jwt.sign(payload, process.env.SECRET_CODE_KEY, { expiresIn: '5m' });
        sendConfirmationEmail(userData.username, userData.email, confirmationCode);
        return res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: '1hr' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const profile = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const confirmEmail = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(401).json({ message: 'No confirmation code provided' });
        }
        let decoded;
        try {
            decoded = jwt.verify(code, process.env.SECRET_CODE_KEY);
        } catch (err) {
            return res.status(403).json({ message: 'Link expired or invalid' });
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isConfirmed) {
            return res.status(409).json({ message: 'Email has already been confirmed.' });
        }
        user.isConfirmed = true;
        await user.save();
        return res.status(200).json({ message: 'Email confirmation successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register, login, profile, confirmEmail };
