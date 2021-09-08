const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    author_details: {
        id: String,
        fullname: String,
        email: String,
        phone: Number,
        role: String
    },
    property_details: {
        property_title: String,
        property_type : String,
        description : String,
        n_bhk : Number

    },
    address : {
        city : String,
        area_details : String
    },
    image : {
        type:String

    },
    quoted_price : {
        type: Number
    },
    is_approved : {
        type: Boolean,
        default: false
    },
    interested :{
        type: [String],
        default:[]
         
    },
    author_email: String

    }, {
        timestamps: true
    });

module.exports = mongoose.model('advertisement', advertisementSchema)