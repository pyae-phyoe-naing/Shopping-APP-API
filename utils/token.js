const jwt = require('jsonwebtoken');

module.exports = {
    makeToken: (payload) => jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn : '1hr'
    })
}