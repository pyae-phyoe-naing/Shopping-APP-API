const fs = require('fs');

const saveFile = (req, res, next) => {
    if (!req.files) {
        next(new Error('Image is required'));
        return;
    }
    let file = req.files.file;
    let fileName = new Date().valueOf() + '_' + file.name;
    file.mv(`./uploads/${fileName}`);
    req.body['image'] = fileName;
    next();
}
const saveFiles = async (req, res, next) => {
    let filenames = [];
    let files = req.files.files;
    files.forEach(file => {
        let fileName = new Date().valueOf() + '_' + file.name;
        file.mv(`./uploads/${fileName}`);
        filenames.push(fileName);
    })
    req.body['images'] = filenames.join(',');
    next();
}
const updateFile = (req, res, next) => {
    if (req.files) {
        let file = req.files.file;
        let fileName = new Date().valueOf() + '_' + file.name;
        file.mv(`./uploads/${fileName}`);
        req.body['image'] = fileName;
    }
    next();

}
const deleteFile = async (filename) => {
    await fs.unlinkSync(`./uploads/${filename}`);
}

module.exports = {
    saveFile,
    saveFiles,
    updateFile,
    deleteFile
}