var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postModel = new Schema({
    Title:{
        type: String
    },
    Location:{
        type: String
    },
    CreatedDate:{
        type: Date
    },
    Text:{
        type: String
    },
    Deleted:{
        type: Boolean
    },
    OwnerId:{
        type: String
    },
    MainPic:{
        type: String
    },
    Memo:{
        type: String
    }

});

module.exports = mongoose.model('Post', postModel);