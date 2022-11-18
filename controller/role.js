const DB = require('../model/role');
const {
    responseMsg
} = require('../utils/helper');

const all = async (req, res, next) => {
    let roles = await DB.find().select('-__v');
    responseMsg(res, true, 'All Roles', roles);
}
const add = async (req, res, next) => {
    let dbRole = await DB.findOne({ name: req.body.name });
    if (dbRole) {
        next(new Error('Role name is already in use'));
    } else {
        let role = await new DB(req.body).save();
        responseMsg(res, true, 'Add New Role', role);
    }
}
const get = async (req, res, next) => {
    let roleData = await DB.findById(req.params.id).select('-__v');
    if (!roleData) {
        next(new Error('Role not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get Role', roleData);
}
const patch = async (req, res, next) => {
    let existRole = await DB.findById(req.params['id']);
    if (existRole) {
        await DB.findByIdAndUpdate(existRole._id, req.body);
        let updateRole = await DB.findById(existRole._id).select('-__v');
        responseMsg(res, true, 'Update Role', updateRole);
    } else {
        next(new Error('Role not found with that ID'));
    }
}
const drop = async (req, res, next) => {
    let existRole = await DB.findById(req.params['id']);
    if (existRole) {
        await DB.findByIdAndDelete(existRole._id);
        responseMsg(res, true, 'Delete Role', existRole);
    } else {
        next(new Error('Role not found with that ID'));
    }
}
module.exports = {
    all,
    add,
    get,
    patch,
    drop
}