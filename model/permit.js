const mongoose = require('mongoose');
const {Schema} = mongoose;

const permitSchema = new Schema({
    name : { type: String, required: true,unique:true},
    created : { type: Date, default: Date.now }
});

const permit = mongoose.model('pemit',permitSchema);
module.exports = permit;