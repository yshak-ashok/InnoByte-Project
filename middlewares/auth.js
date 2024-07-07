const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];// Get the authorization header from the request
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the authorization header
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
     // Verify the token using the secret key
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;// If the token is valid, attach the user object to the request
        next();// Call the next middleware or route handler
    });
};

module.exports = authenticateToken;
