/**
 * Created by rob on 5/06/17.
 */

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const channelSchema =schema({

    name : {
        type : mongoose.Schema.Types.String,
        unique : true,
        required : true,
    },

});


module.exports = mongoose.model('Channel',channelSchema);