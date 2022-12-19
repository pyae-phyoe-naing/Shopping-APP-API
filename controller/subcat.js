const DB = require('../model/subcat');
const categoryDB = require('../model/category');
const {
    responseMsg
} = require('../utils/helper');
const {
    deleteFile
} = require('../utils/gallergy');

const all = async (req, res) => {
    let subcats = await DB.find();
    responseMsg(res, true, 'All Sub Categories', subcats);
}
const add = async (req, res, next) => {
    let dbName = await DB.findOne({
        name: req.body.name
    });
    if (dbName) {
        deleteFile(req.body.image);
        next(new Error('Sub Category name is already in use'));
        return;
    }
    // Check category exist 
    let dbCategory = await categoryDB.findById(req.body.catId);
    if (!dbCategory) {
        deleteFile(req.body.image);
        next(new Error('Category not found with That ID'));
        return;
    }
    // Add New Sub Cat
    let subcat = await new DB(req.body).save();
    // Add parent category in subcat ID
    await categoryDB.findByIdAndUpdate(dbCategory._id, {
        $push: {
            subcats: subcat._id
        }
    })
    responseMsg(res, true, 'Sub Category create successfully', subcat);
}
const get = async (req, res, next) => {
    let dbSubCat = await DB.findById(req.params.id).select('-__v');
    if (!dbSubCat) {
        next(new Error('Sub Category not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get Sub Category', dbSubCat);
}
const drop = async (req, res, next) => {
    let dbSubCat = await DB.findById(req.params.id).select('-__v');
    if (!dbSubCat) {
        next(new Error('Sub Category not found with that ID'));
        return;
    }
    // remove subcat ID from parent category
    await categoryDB.findByIdAndUpdate(dbSubCat.catId, {
        $pull: {
            subcats: dbSubCat._id
        }
    });
    // delet sub category
    deleteFile(dbSubCat.image);
    await DB.findByIdAndDelete(dbSubCat._id);
    responseMsg(res, true, 'Delete Sub Category');
}
const patch = async (req, res, next) => {
    // check ID subcat exist or in DB
    let dbEsixtSubCat = await DB.findById(req.params.id);
    if (!dbEsixtSubCat) {
        if (req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error('Sub Category not found with that ID!'));
        return;
    }
    // Check SubCat Name in already exist in DB without expert ID
    let subcats = await DB.find();
    let checkNameExist = subcats.find((subcat) => subcat._id != req.params.id && req.body.name === subcat.name);
    if (checkNameExist) {
        if (req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error('Sub Category name is already in use'));
        return;
    }
    // Check category exist 
    let dbCategory = await categoryDB.findById(req.body.catId);
    if (!dbCategory) {
        if (req.body.image) {
         deleteFile(req.body.image);
        }
        next(new Error('Category not found with That ID'));
        return;
    }
    // Update Sub Cat
    if (req.body.image) {
        deleteFile(dbEsixtSubCat.image);
    }
    await DB.findByIdAndUpdate(dbEsixtSubCat._id, req.body);
    let updateSubCat = await DB.findById(dbEsixtSubCat._id);
    // Update parent category in subcat ID
    await categoryDB.findByIdAndUpdate(dbEsixtSubCat.catId,{$pull:{subcats:dbEsixtSubCat._id}});
    await categoryDB.findByIdAndUpdate(updateSubCat.catId, {$push:{subcats: updateSubCat._id}})
    responseMsg(res, true, 'Sub Category update successfully', updateSubCat);
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}