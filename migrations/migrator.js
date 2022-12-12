const fs = require('fs');
const { encode } = require('../utils/helper');
const userDB = require('../model/user');
const roleDB = require('../model/role');
const permitDB = require('../model/permit');

const migrate = () => {
    let data = fs.readFileSync('./migrations/user.json');
    let users = JSON.parse(data);
    users.forEach(async (user) => {
        user.password = encode(user.password);
        let insertUser = await new userDB(user).save();
        console.log(insertUser);
    });
}
const rolePermitMigrate = () => {
    let data = fs.readFileSync('./migrations/rolepermit.json');
    let rolePermit = JSON.parse(data);
    rolePermit.roles.forEach(async (role) => {
        let insertRole = await new roleDB(role).save();
        console.log(insertRole);
    });
    rolePermit.permits.forEach(async (permit) => {
        let insertPermit = await new permitDB(permit).save();
        console.log(insertPermit);
    });
}
const backup = async() => {
    let users = await userDB.find();
    fs.writeFileSync('./migrations/backups/user.json', JSON.stringify(users));
    console.log('Success Backup Data');
}

module.exports = {
    migrate,
    rolePermitMigrate,
    backup
}