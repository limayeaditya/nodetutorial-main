const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    author: {
        type: String,
    },
    property_details: {
        property_type : String,
        description : String,
        n_bhk : Number

    },
    address : {
        city : String,
        area_details : String
    },
    images : {
        type: [String],
        default: null
    },
    quoted_price : {
        type: Number
    },
    is_approved : {
        type: Boolean
    },
    intrestes :{
        type: Number
    }

    }, {
        timestamps: true
    });

module.exports = mongoose.model('article', articleSchema)