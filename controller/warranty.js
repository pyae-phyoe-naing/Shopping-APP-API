const DB = require('../model/warranty');
const {
    responseMsg
} = require('../utils/helper');

const all = async (req, res) => {
    let warrantys = await DB.find().select('-__v');
    responseMsg(res, true, 'All Warranty', warrantys);
}
const add = async (req, res, next) => {
    // Check unique warranty name !
    const dbName = await DB.findOne({
        name: req.body.name
    });
    if (dbName) {
        next(new Error('Warranty name is already exist'));
        return;
    }
    // Add New Warranty
     req.body.remark = req.body.remark.split(',');
    let warranty = await new DB(req.body).save();
    responseMsg(res, true, 'Add warranty success', warranty);
}
const get = async (req, res, next) => {
    let dbWarranty = await DB.findById(req.params.id).select('-__v');;
    if (!dbWarranty) {
        next(new Error('Warranty not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get Warranty', dbWarranty);
}
const drop = async (req, res, next) => {
    let dbWarranty = await DB.findById(req.params.id);
    if (!dbWarranty) {
        next(new Error('Warranty not found with that ID'));
        return;
    }
    // delet Warranty
    try {
        await DB.findByIdAndDelete(dbWarranty._id);
        responseMsg(res, true, 'Delete warranty!');
    } catch (e) {
        next(new Error(false, 'Something wrong'));
    }

}
const patch = async (req, res, next) => {
    // check ID Warranty exist or in DB
    let dbWarranty = await DB.findById(req.params.id);
    if (!dbWarranty) {
        next(new Error('Delivery not found with that ID!'));
        return;
    }
    // Check Warranty Name in already exist in DB without expert ID
    let warranties = await DB.find();
    let checkNameExist = warranties.find((warranty) => warranty._id.toString() !== req.params.id && req.body.name.split(' ').join('').toLowerCase() === warranty.name.split(' ').join('').toLowerCase());
    if (checkNameExist) {
        next(new Error('Warranty name is already in use'));
        return;
    }
    // Update Warranty
    try {
        if (req.body.remark) {
         req.body.remark = req.body.remark.split(',');
        }
        await DB.findByIdAndUpdate(dbWarranty._id, req.body);
        let updateWarranty = await DB.findById(dbWarranty._id);
        responseMsg(res, true, 'Warranty update successfully', updateWarranty);
    } catch (e) {
        next(new Error('Something wrong'));
    }

}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}