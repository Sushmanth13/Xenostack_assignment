const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        email
    });

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).send('Error creating user');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Set cookie
    res.json({ message: 'Login successful', token });
});


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// In your backend auth routes file
router.get('/check', (req, res) => {
    if (req.cookies.token) {
        jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ isAuthenticated: false });
            res.json({ isAuthenticated: true });
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});


module.exports = router;
