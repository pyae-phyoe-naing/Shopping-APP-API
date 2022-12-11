const fs = require('fs');
const { encode } = require('../utils/helper');
const userDB = require('../model/user');

const migrate = () => {
    let data = fs.readFileSync('./migrations/user.json');
    let users = JSON.parse(data);
    users.forEach(async (user) => {
        user.password = encode(user.password);
        let insertUser = await new userDB(user).save();
        console.log(insertUser);
    });
}

module.exports = {
    migrate
}