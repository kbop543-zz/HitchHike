var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        usertype: {
            type: Number, default: 0
        },
        username: {
            type: String, required: true
        },
        password: {
            type: String, required: true
        },
        firstName : {
            type: String, required: true
        },
        lastName : {
            type: String, required: true
        },
        driver : {
            type: Number, required: true, default: 0
        },
        licensePlate: { 
            type: String, required: false
        },
        carModel:{
            type: String, required: false
        },
        email: {
            type: String, required: true
        }        
    },
    {
        collection: 'users'
    }
);

mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose.model('User', userSchema);
