const Redis = require('../utils/redis');
const {makeToken} = require('../utils/token');
const DB = require('../model/user');
const roleDB = require('../model/role');
const {
    encode,
    responseMsg,
    comparePass
} = require('../utils/helper');

const register = async (req, res, next) => {
    let dbEmail = await DB.findOne({
        email: req.body.email
    });
    if (dbEmail) {
        next(new Error('Email is already in use!'));
        return;
    }
    let dbPhone = await DB.findOne({
        phone: req.body.phone
    });
    if (dbPhone) {
        next(new Error('Phone number is already in use!'));
        return;
    }
    req.body.password = encode(req.body.password);
    let user = await new DB(req.body).save();
    responseMsg(res, true, 'Register success', user);
}

const login = async (req, res, next) => {
    let existUser = await DB.findOne({
        phone: req.body.phone
    }).populate('roles permits','-__v').select('-__v');
    if (!existUser) {
        next(new Error('Creditial Error'));
        return;
    }
    // check password
    let checkPass = comparePass(req.body.password, existUser.password);
    if (!checkPass) {
        next(new Error('Creditial Error'));
        return;
    }
    let user = existUser.toObject(); // change mongo object to java script object
    delete user.password;
    user.token = makeToken(user);
    Redis.set(user._id, user);
    responseMsg(res, true, 'Login success', user);
}
const addRole = async (req,res,next) => {

    let checkUser = await DB.findById(req.body.userId);
    if (!checkUser) {
        next(new Error('User not found.'));
        return;
    }
    let checkRole = await roleDB.findById(req.body.roleId);
    if (!checkRole) {
         next(new Error('Role not found.'));
         return;
    }
    // Check Role exist in User
    if (checkUser.roles.includes(checkRole._id)) {
        next(new Error('Role is already exist!'));
        return;
    }
    // Add Role in User
    await DB.findByIdAndUpdate(checkUser._id, { $push: { roles: checkRole._id } });
    let result = await DB.findById(checkUser._id).populate('roles permits','-__v -created').select('-__v -password');
    responseMsg(res, true, 'Role add success', result);
}
module.exports = {
    register,
    login,
    addRole
}