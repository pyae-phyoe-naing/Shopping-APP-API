const DB = require('../model/permit');
const { responseMsg } = require('../utils/helper');

const add = async (req, res, next) => {
    let dbPermit = await DB.findOne({ name: req.body.name });
    if (dbPermit) {
        next(new Error("Permission name is already in use"));
    } else {
        console.log(req.body.name);
        let result = await new DB(req.body).save();
        responseMsg(res,true,'Add New Permission', result);
    }
}

module.exports = {
    add
}