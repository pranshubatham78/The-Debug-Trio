const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 16, // Minimum length validation
        trim: true,
    },
    house: {
        type: String,
        trim: true,
    },
    DegreeLevel: {
        type: String,
        required: true,
        trim: true,
    },
    currentTerm: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    otp: String,
    otpExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now, // Pass Date.now as reference
    },
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt); // Store hashed password
            next();
        } catch (error) {
            console.error("Error hashing password:", error.message);
            next(error);
        }
    } else {
        next();
    }
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
