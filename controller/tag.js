const DB = require('../model/tag');
const { responseMsg } = require('../utils/helper');
const { deleteFile } = require('../utils/gallergy');

const all = async (req, res) => {
     let tags = await DB.find().select('-__v');
     responseMsg(res, true, 'All Tags', tags);
}
const add = async (req, res, next) => {
        // Check unique tag name !
        const dbName = await DB.findOne({
            name: req.body.name
        });
        if (dbName) {
            deleteFile(req.body.image);
            next(new Error('Tag name is already in use'));
            return;
        }
        // Add New child Cat
        let tag = await new DB(req.body).save();   
        responseMsg(res, true, 'Add tag success', tag);
}
module.exports = {
    all,
    add
}