const DB = require('../model/childcat');
const subcatDB = require('../model/subcat');
const {
    deleteFile
} = require('../utils/gallergy');
const {
    responseMsg
} = require('../utils/helper');


const all = async (req, res) => {
    let childcats = await DB.find().populate({
        path: 'subcatId',
        select: '-__v',
        populate: {
            path: 'childcats',
            model: 'childcat',
            select: '-__v'
        }
    }).select('-__v');
    responseMsg(res, true, 'All ChildCat', childcats);
}

const add = async (req, res, next) => {
    // Check unique childcat name !
    const dbName = await DB.findOne({
        name: req.body.name
    });
    if (dbName) {
        deleteFile(req.body.image);
        next(new Error('ChildCategory name is already in use'));
        return;
    }
    // Check Sub category exist 
    let dbSubCat = await subcatDB.findById(req.body.subcatId);
    if (!dbSubCat) {
        deleteFile(req.body.image);
        next(new Error('Sub Category not found with That ID'));
        return;
    }
    // Add New child Cat
    let childcat = await new DB(req.body).save();
    //  Sub Category in save childcat ID
    await subcatDB.findByIdAndUpdate(dbSubCat._id, {
        $push: {
            childcats: childcat._id
        }
    })
    responseMsg(res, true, 'Add childcat success', childcat);
}
const get = async (req, res, next) => {
    let dbChildCat = await DB.findById(req.params.id).populate('subcatId', '-__v -created').select('-__v');;
    if (!dbChildCat) {
        next(new Error('Child Category not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get Child Category', dbChildCat);
}
const drop = async (req, res, next) => {
    let dbChildCat = await DB.findById(req.params.id).select('-__v');
    if (!dbChildCat) {
        next(new Error('Child Category not found with that ID'));
        return;
    }
    try {
        // remove childcat ID from parent subcatList
        await subcatDB.findByIdAndUpdate(dbChildCat.subcatId, {
            $pull: {
                childcats: dbChildCat._id
            }
        });
        // delet child category
        deleteFile(dbChildCat.image);
        await DB.findByIdAndDelete(dbChildCat._id);
        responseMsg(res, true, 'Delete Child Category');
    } catch (e) {
        next(new Error(false, 'Something wrong'));
    }

}
module.exports = {
    all,
    add,
    get,
    drop
}