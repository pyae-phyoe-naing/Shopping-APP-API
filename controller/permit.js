const DB = require('../model/permit');
const { responseMsg } = require('../utils/helper');

const all = async (req, res, next) => {
    let permissions = await DB.find();
    responseMsg(res, true, 'All Permissions', permissions);
}

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
const get = async (req, res, next) => {
    let permitData = await DB.findById(req.params.id);
    if (!permitData) {
        next(new Error('Permission not found with that ID'));
        return;
    }
     responseMsg(res, true, 'Get Permission', permitData);
}
const patch = async (req, res, next) => {
    let existPermit = await DB.findById(req.params['id']);
    if (existPermit) {
        await DB.findByIdAndUpdate(existPermit._id, req.body);
        let updatePermit = await DB.findById(existPermit._id);
     responseMsg(res, true, 'Update Permission',updatePermit);
    } else {
        next(new Error('Permission not found with that ID'));
    }
}
const drop = async (req, res, next) => {
    let existPermit = await DB.findById(req.params['id']);
    if (existPermit) {
        await DB.findByIdAndDelete(existPermit._id);
        responseMsg(res, true, 'Delete Permission', existPermit);
    } else {
        next(new Error('Permission not found with that ID'));
    }
}
module.exports = {
    all,
    add,
    get,
    patch,
    drop
}