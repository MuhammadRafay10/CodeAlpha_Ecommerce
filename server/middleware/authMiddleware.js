const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token ko extract karna (Bearer token_yahan_hota_hai)
            token = req.headers.authorization.split(' ')[1];

            // Token verify karna
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User ka data req object mein daal dena (password ke alawa)
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };