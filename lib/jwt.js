const jwt = require('jsonwebtoken');

const jwtSign = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
}

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return false;
    }
}

module.exports = { jwtSign, jwtVerify }