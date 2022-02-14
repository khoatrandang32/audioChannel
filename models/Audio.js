const mongoose= require('mongoose')

const AudioSchema = mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: [true, 'Title is required']
    },
    thumbnailUrl:{
        type: String,
        unique: true,
        required: [true, 'Thumbnail Url is required']
    },
    comments:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}
      ],
    author:{
        type: String,
        required: [true, 'Author is required']
    },
    reader:{
        type: String,
        required: [true, 'Reader is required']
    },
    decription:{
        type: String,
        required: [true, 'Decription is required'],
    },
    baseEpisode:{
        type: String,
        required: [true, 'baseEpisode is required'],
    },
    episodesAmount:{
        type:Number,
    },
    categories:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Categories'}
      ],

    createAt:{
        type: Date,
        default: Date.now
    }
});
 
module.exports = mongoose.model("Audios",AudioSchema)