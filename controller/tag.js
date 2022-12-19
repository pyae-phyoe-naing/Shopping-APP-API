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
const get = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id).select('-__v');;
    if (!dbTag) {
        next(new Error('Tag not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get tag', dbTag);
}

const drop = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id).select('-__v');
    if (!dbTag) {
        next(new Error('Tag not found with that ID'));
        return;
    }
    try {
        // delet tag
        deleteFile(dbTag.image);
        await DB.findByIdAndDelete(dbTag._id);
        responseMsg(res, true, 'Delete tag!');
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