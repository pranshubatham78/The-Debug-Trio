const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/user');
const appConfig = require("../config/appConfig");

const authProtection = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, appConfig.auth.jwt);

            // Find user by ID, excluding password field
            req.user = await userModel.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ status: "error", message: "Unauthorized: User not found" });
            }

            next();
        } catch (error) {
            console.error("Token verification error:", error.message);
            return res.status(401).json({ status: "error", message: "Unauthorized: Invalid token" });
        }
    } else {
        return res.status(401).json({ status: "error", message: "Unauthorized: No token provided" });
    }
});

module.exports = authProtection;
