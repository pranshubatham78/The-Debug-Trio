const jwt = require("jsonwebtoken");
const appConfig = require("../config/appConfig");

const generateToken = (id , tokenVersion)=>{
    return jwt.sign({id, tokenVersion}, appConfig.auth.jwt, {
        expiresIn : appConfig.auth.tokenExpire,
    });
};


module.exports = generateToken;
