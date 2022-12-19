const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const subcatSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    catId : {type:Schema.Types.ObjectId,ref:'category',required:true},
    childcats: [{
        type: Schema.Types.ObjectId,
        ref: 'childcat'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});
const SubCat = mongoose.model('subcat', subcatSchema);
module.exports = SubCat;