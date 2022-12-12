const Redis = require('../utils/redis');
const DB = require('../model/user');
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
    Redis.set(user._id, user);
    responseMsg(res, true, 'Login success', user);
}

module.exports = {
    register,
    login
}