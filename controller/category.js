const DB = require('../model/category');
const {
    deleteFile
} = require('../utils/gallergy');
const {
    responseMsg
} = require('../utils/helper');

const all = async (req, res, next) => {
    let cats = await DB.find().populate({
        path: 'subcats',
        select : '-__v',
        populate: {
            path: 'childcats',
            model: 'childcat',
            select:'-__v'
        }
    }).select('-__v');
    responseMsg(res, true, 'All Categories', cats);
}

const add = async (req, res, next) => {
    const dbName = await DB.findOne({
        name: req.body.name
    });
    if (dbName) {
        deleteFile(req.body.image);
        next(new Error('Category name is already in use'));
        return;
    }
    let cat = await new DB(req.body).save();
    responseMsg(res, true, 'Category create successfully', cat);
}
const get = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id).select('-__v');
    if (!dbCat) {
        next(new Error('Category not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get Category', dbCat);
}
const drop = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id).select('-__v');
    if (!dbCat) {
        next(new Error('Category not found with that ID'));
        return;
    }
    // delet category
    deleteFile(dbCat.image);
    await DB.findByIdAndDelete(dbCat._id);
    responseMsg(res, true, 'Delete Category');
}
const patch = async (req, res, next) => {
    // Check Exist Category in DB
    let dbCat = await DB.findById(req.params.id).select('-__v');
    if (!dbCat) {
        if (req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error('Category not found with that ID'));
        return;
    }
    // Check Category name unique with expert ID
    let cats = await DB.find();
    let checkExistName = cats.find((cat) => cat._id.toString() !== dbCat._id.toString() && cat.name === req.body.name);
    // console.log(typeof (dbCat._id)); // object
    // console.log(typeof (req.params.id)); // string
    if (checkExistName) {
        if (req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error('Category name is already in use!'));
        return;
    }
    // check has image
    if (req.body.image) {
        deleteFile(dbCat.image);
    }
    // update category
    await DB.findByIdAndUpdate(dbCat._id, req.body);
    let update = await DB.findById(dbCat._id);
    // console.log(req);
    responseMsg(res, true, 'Update Category', update);
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}