const DB = require('../model/childcat');
const subcatDB = require('../model/subcat');
const { responseMsg } = require('../utils/helper');


const all = async (req, res) => {
    let childcats = await DB.find().populate('subcatId','-__v -created').select('-__v');
    responseMsg(res, true, 'All ChildCat', childcats);
}


module.exports = {
all
}