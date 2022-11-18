const DB = require('../model/role');
const permitDB = require('../model/permit');
const {
    responseMsg
} = require('../utils/helper');

const all = async (req, res, next) => {
    let roles = await DB.find().populate('permits','-__v').select('-__v');
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
const roleAddPermit = async (req, res, next) => {
    const existPermit = await permitDB.findById(req.body.permitID);
    const existRole = await DB.findById(req.body.roleID);

    if (existPermit && existRole) {
        let permitExistInRole = existRole.permits.includes(existPermit._id);
        if (!permitExistInRole) {
                    await DB.findByIdAndUpdate(existRole._id, {
                        $push: {
                            permits: existPermit._id
                        }
                    });
                    let role = await DB.findById(existRole._id).populate('permits','-__v').select('-__v');
                    responseMsg(res, true, 'Add Permission in Role', role);
        } else {
                next(new Error('This permission is already exists.'));
        }

    } else {
         next(new Error('Can not add permission.Check RoleID and PermitID'));
    }

}
const roleRemovePermit = async (req, res, next) => {
    const existPermit = await permitDB.findById(req.body.permitID);
    const existRole = await DB.findById(req.body.roleID);

    if (existPermit && existRole) {
        let permitExistInRole = existRole.permits.includes(existPermit._id);
        if (permitExistInRole) {
            await DB.findByIdAndUpdate(existRole._id, {
                $pull: {
                    permits: existPermit._id
                }
            });
            let role = await DB.findById(existRole._id).populate('permits', '-__v').select('-__v');
            responseMsg(res, true, 'Remove Permission in Role', role);
        } else {
            next(new Error('This permission is not exists in role.'));
        }

    } else {
        next(new Error('Can not remove permission.Check RoleID and PermitID'));
    }

}
module.exports = {
    all,
    add,
    get,
    patch,
    drop,
    roleAddPermit,
    roleRemovePermit
}