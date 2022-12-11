const DB = require('../model/user');
const {
    encode,
    responseMsg
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


module.exports = {
    register
}