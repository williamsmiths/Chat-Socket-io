/**
 * Created by rob on 4/06/17.
 */
const jwt = require('jsonwebtoken');
//obviously
const secret = 'abcdefg';
//const models = require('./models.js');

(function(){



    module.exports = {
        generateToken : generateToken,
        checkToken : checkToken,
        decodeToken : decodeToken
    };

    //generates a token for the user
    function generateToken(userName){

        let token = jwt.sign({ username : userName }, secret, {expiresIn : '3h'});
        try{
            return token;
        }  catch(err) {
            // err
            console.log(err);
        }
    }

    //takes a token a verifies it using our secret, returns true if valid, false otherwise
    function checkToken(token){
        try{
            jwt.verify(token, secret);
            return true;
        } catch(err) {
            return false;
        }
    }

    function decodeToken(token){
        return jwt.decode(token);
    }


})();