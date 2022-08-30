/**
 * Created by rob on 5/06/17.
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema =schema({

    text : {
        type : mongoose.Schema.Types.String,
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    timestamp : {
        type : mongoose.Schema.Types.Date,
        required : true
    },
    channel : {
        type: mongoose.Schema.Types.String,
        required: true,
    }

});


module.exports = mongoose.model('Message',messageSchema);