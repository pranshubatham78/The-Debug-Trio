const asynchandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const user = require('../models/user');
const generateToken = require('../util/generateToken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


// Register
const Register = asynchandler(async (req, res) => {
    const { name, email, password, house , DegreeLevel , currentTerm , gender } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            // If user exists, respond with a token for the existing user
            return res.status(200).json({
                message: 'User already exists',
                token: generateToken(existingUser._id), // Generate token for existing user
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.currentTerm,
                }
            });
        }

        // Create a new user
        const userCreate = await user.create({ name, email, password, house , DegreeLevel , currentTerm , gender});
        if (userCreate) {
            // Respond with the newly created user's details and token
            return res.status(200).json({
                _id: userCreate._id,
                email: userCreate.email,
                token: generateToken(userCreate._id) // Generate token for new user
            });
        } else {
            // Handle failure in user creation
            return res.status(400).json({ message: "User not able to be created" });
        }
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ message: error.message });
    }
});

// Login
const login = asynchandler(async (req, res) => {
    const { email,password } = req.body;
    try {
        // checking existence
        const usercheck = await user.findOne({ email });
        if (usercheck && (await usercheck.matchPassword(password))) {
            return res
                .status(200)
                .json({
                    _id: usercheck._id,
                    email: usercheck.email,
                    token: generateToken(usercheck._id) // passing playload while login for generating the webtoken.
                });

        } else {
            res
                .status(401)
                .json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.json({ message: error.message })
    }

});

//Logout
const logout = asynchandler(async (req, res) => {
    // Since JWT is stateless, "logout" can be a client-side token removal action.  ----> how to remove the client side token?
    res.status(200).json({
        message: "Logged out successfully",
    });
});

//Request Forget password
const requestPasswordReset = asynchandler(async (req, res) => {
    const { email } = req.body;

    // checking user existence
    const ExistingUser = await user.findOne({ email });
    if (!ExistingUser) {
        return res.status(404).json({
            message: "User is not exist with this id"
        });
    }

    // otp generation
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 6);

    // Store otp and expiration time in the database.
    ExistingUser.otp = otp;
    ExistingUser.otpExpire = otpExpire;
    await ExistingUser.save();

    // Nodemail configuration.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            pass: process.env.EMAIL_APP_PASSWORD,
            user: process.env.EMAIL_ID,
        }
    });

    // format of the email
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: req.body.email,
        subject: "Password resest otp",
        text: `Your OTP (It's expired after 6min) : ${otp}`,
    };

    // sending email
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(404).json({
                "message": "Error occured while sending mail",
                error: err.message,
            });
        } else {
            return res.json({
                data: "Your OTP send to the mail"
            });
        }
    });

});

// resetPassword
const resetPassword = asynchandler(async (req, res) => {
    const { otp, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        return res.status(404).json({
            message: "Password not match"
        });
    }

    // convert otp in string
    const otpStr = String(otp);

    // find the user witht the otp check expiration time
    const ExistingUser = await user.findOne({otp: otpStr , otpExpire : {$gt : new Date()}});
    if(!ExistingUser){
        console.log("Invalid OTP or expired:", otp);
        return res.status(404).json({message: "Invalid or expired OTP"});
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password) , salt);  // While hashing the password we need a password in the string format.So, if you pass the password in the int format then you'll face an error due to that we need to change the password into the string format.

    // update the user with the new password
    ExistingUser.password = hashedPassword;
    ExistingUser.otp = null;
    ExistingUser.otpExpire = null;
    await ExistingUser.save();

    res.status(200).json({"message" : "Password reset successful"});
});

module.exports={
    Register,
    login,
    logout,
    requestPasswordReset,
    resetPassword
};




