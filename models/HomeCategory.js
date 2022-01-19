const mongoose= require('mongoose')

const HomeCategorySchema = mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: [true, 'Title is required']
    },
    listAudio:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Audios'}
    ]
});
 
module.exports = mongoose.model("HomeCategory",HomeCategorySchema)