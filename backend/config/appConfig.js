const dotenv = require("dotenv");
const { mongo } = require("mongoose");

const appConfig = {
    
    // server config 
    server : {
        port : process.env.PORT || 8000,
        baseUrl : process.env.BASE_URL || 'http://localhost',
    },
    //  DB config
    database : {
        DbUrl : process.env.MONGO_URL || 'mongodb://localhost:27017/iitm-dashboard'
    },
    // authentication config
    auth : {
        jwt : process.env.JWT_SECRET_KEY || 'mysecretToken',
        tokenExpire : '1hr',
    },
    // External service config
    externalServices: {
        emailID  : process.env.EMAIL_ID,
        emailAppPassword : process.env.EMAIL_APP_PASSWORD,
      },
    // feature toggle---> don't know
    features: {
        enableGamification: process.env.ENABLE_GAMIFICATION === 'true',
        enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
      },
    
      // Logging settings---> don't know
      logging: {
        level: process.env.LOG_LEVEL || 'info', // Levels: debug, info, warn, error
      },


};

module.exports = appConfig;
