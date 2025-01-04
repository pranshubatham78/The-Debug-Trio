const jwt = require("jsonwebtoken");
const user = require("../models/user");
const asynchandler =require("express-async-handler");
const appConfig = require("../config/appConfig");

const protect = asynchandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, appConfig.auth.jwt);
        const currentUser = await user.findById(decoded.id);

        if (!currentUser || currentUser.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
});

module.exports = protect;
