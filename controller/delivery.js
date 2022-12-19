const DB = require('../model/delivery');
const {
    responseMsg
} = require('../utils/helper');

const all = async (req, res) => {
    let deliverys = await DB.find().select('-__v');
    responseMsg(res, true, 'All Delivery', deliverys);
}
const add = async (req, res, next) => {
    // Check unique delivery name !
    const dbName = await DB.findOne({
        name: req.body.name
    });
    if (dbName) {
        next(new Error('Delivery name is already exist'));
        return;
    }
    // Add New Delivery
    req.body.remark = req.body.remark.split(',');
    let delivery = await new DB(req.body).save();
    responseMsg(res, true, 'Add delivery success', delivery);
}
const get = async (req, res, next) => {
    let dbDelivery = await DB.findById(req.params.id).select('-__v');;
    if (!dbDelivery) {
        next(new Error('Delivery not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get tag', dbDelivery);
}
const drop = async (req, res, next) => {
    let dbDelivery = await DB.findById(req.params.id);
    if (!dbDelivery) {
        next(new Error('Delivery not found with that ID'));
        return;
    }
    // delet delivery
    try {
        await DB.findByIdAndDelete(dbDelivery._id);
        responseMsg(res, true, 'Delete delivery!');
    } catch (e) {
        next(new Error(false, 'Something wrong'));
    }

}
const patch = async (req, res, next) => {
    // check ID delivery exist or in DB
    let dbDelivery = await DB.findById(req.params.id);
    if (!dbDelivery) {
        next(new Error('Delivery not found with that ID!'));
        return;
    }
    // Check Delivery Name in already exist in DB without expert ID
    let deliveries = await DB.find();
    let checkNameExist = deliveries.find((delivery) => delivery._id.toString() !== req.params.id && req.body.name.split(' ').join('').toLowerCase() === delivery.name.split(' ').join('').toLowerCase());
    if (checkNameExist) {
        next(new Error('Delivery name is already in use'));
        return;
    }
    // Update Delivery
    try {
        await DB.findByIdAndUpdate(dbDelivery._id, req.body);
        let updateDelivery = await DB.findById(dbDelivery._id);
        responseMsg(res, true, 'Delivery update successfully', updateDelivery);
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