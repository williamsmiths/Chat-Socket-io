/**
 * Created by rob on 4/06/17.
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const secret = 'abcdefg';
const crypto = require('crypto');

const userSchema =schema({

    username : {
        type : mongoose.Schema.Types.String,
        unique : true,
        required : true,
    },
    password : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    channels : [
        {
            type: mongoose.Schema.Types.String
        }
    ],
});

userSchema.methods.addChannel = function(channel){
   if(this.channels.indexOf(channel)<0){
       this.channels.push(channel);
   }
};

module.exports = mongoose.model('User',userSchema);