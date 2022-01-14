const mongoose= require('mongoose')

const CategorySchema = mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: [true, 'Title is required']
    },
});
 
module.exports = mongoose.model("Categories",CategorySchema)