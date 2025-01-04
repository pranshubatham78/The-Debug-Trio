const express = require("express");
const {Register,login,logout,requestPasswordReset,resetPassword} = require("../controllers/userController");
const protect = require("../middleware/logoutMiddleware");
const authentication = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", Register);
router.post("/login", authentication,login );
router.post("/logout", protect,logout);
router.post("/requestPasswordReset", requestPasswordReset);
router.post("/resetPassword", resetPassword);

module.exports = router;
