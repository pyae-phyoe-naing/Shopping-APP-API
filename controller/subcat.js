const DB = require('../model/subcat');
const { responseMsg } = require('../utils/helper');

const all = async (req, res) => {
    let subcats = await DB.find();
    responseMsg(res, true, 'All Sub Categories', subcats);
}
const add = async (req, res, next) => {
        const dbName = await DB.findOne({
            name: req.body.name
        });
        if (dbName) {
            deleteFile(req.body.image);
            next(new Error('Sub Category name is already in use'));
            return;
        }
        let subcat = await new DB(req.body).save();
        responseMsg(res, true, 'Sub Category create successfully', subcat);
}
module.exports = {
    all,
    add
}