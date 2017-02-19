var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentModel = new Schema({
    
    CreatedDate:{
        type: Date
    },
    Text:{
        type: String
    },
    Deleted:{
        type: Boolean
    },
    CommenterId:{
        type: String
    },
    PostId:{
        type: String
    }

});

module.exports = mongoose.model('Comment', commentModel);