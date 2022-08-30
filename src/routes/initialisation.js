/**
 * Created by rob on 6/06/17.
 */


//intialisation
const models = require('../models');
const crypto = require('crypto');
const secret = 'abcdefg';

module.exports = function(){

    console.log("starting set up");

    //add admin user
    let hashedPassword = crypto.createHmac('sha256', secret)
        .update('admin')
        .digest('hex');

    let adminUser = new models.User({ username : 'admin', password : hashedPassword});
    adminUser.save().then((e) => {
        console.log("Default Admin user added");
    }).catch((err)=>{
        console.log("Admin User already Exists");
    });

//add default channel
    let defaultChannel = new models.Channel({ name : 'default'});
    defaultChannel.save().then((e) => {
        console.log("default channel created");
    }).catch((err) => {
        console.log("default channel already exists");
    })


};