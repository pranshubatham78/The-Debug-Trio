const mongoose = require("mongoose");
const appConfig = require("./appConfig");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(appConfig.database.DbUrl, {
        });
        console.log(`Database connected: Host - ${connection.connection.host}, Name - ${connection.connection.name}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
