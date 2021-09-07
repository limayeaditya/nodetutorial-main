const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    role : {
      type: String,
      default: "user" 
    },
    fullname: {
        type: String
    },
    mobile: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    profile_picture: {
        type: String,
        default: null
    },
    is_subscribed:{
        type: Boolean,
        default: false
    },
    contacted_ads: {
        type:[String]
    }
    }, {
        timestamps: true
    });

module.exports = mongoose.model('user', userSchema)