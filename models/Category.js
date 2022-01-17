const mongoose= require('mongoose')

const CategorySchema = mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: [true, 'Title is required']
    },
    imgThumbnail:{
        type: String,
        required: [true, 'imgThumbnail is required']
    },
});
 
module.exports = mongoose.model("Categories",CategorySchema)