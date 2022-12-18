const DB = require('../model/category');
const { deleteFile } = require('../utils/gallergy');
const {
    responseMsg
} = require('../utils/helper');

const all = async (req, res, next) => {
    let cats = await DB.find();
    responseMsg(res, true, 'All Categories', cats);
}

const add = async (req, res, next) => {
    const dbName = await DB.findOne({ name: req.body.name });
    if (dbName) {
        deleteFile(req.body.image);
        next(new Error('Category name is already in use'));
        return;
    }
    let cat = await new DB(req.body).save();
    responseMsg(res, true, 'Category create successfully',cat);
}
const get = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id).select('-__v');
      if (!dbCat) {
          next(new Error('Category not found with that ID'));
          return;
      }
      responseMsg(res, true, 'Get Category', dbCat);
}
module.exports = {
    all,
    add,
    get
}