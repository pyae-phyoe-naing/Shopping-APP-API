const DB = require('../model/childcat');
const subcatDB = require('../model/subcat');
const { deleteFile } = require('../utils/gallergy');
const {
    responseMsg
} = require('../utils/helper');


const all = async (req, res) => {
    let childcats = await DB.find().populate('subcatId', '-__v -created').select('-__v');
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
    responseMsg(res, true, 'Add childcat success',childcat);
}

module.exports = {
    all,
    add
}