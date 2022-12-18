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
module.exports = {
    all,
    add
}