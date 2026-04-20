const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Check against special admin account from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPass) {
        // Issue token
        const token = jwt.sign(
            { email: adminEmail, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: { email: adminEmail, role: 'admin' }
        });
    }

    // In the future, we could check DB for other users here
    // const user = await User.findOne({ email });
    // if(user && bcrypt.compareSync(password, user.password))...

    return res.status(401).json({ error: 'Invalid credentials' });
});

// A route just to verify the token validity on app load
router.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(!token) return res.status(401).json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch(err) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
