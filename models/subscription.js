const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    author: {
        type: String
    },
    payment_type: {
        type: String
    },
    amount : {
        type: Number
    },
    subscription_date:{
        type: String
    },
    expiry_date:{
        type: String
    },
    payment_details : {
        card_number :{
            type: String,
            default: null
        },
        VPA : {
            type: String,
            default: null
        }
    }

    }, {
        timestamps: false
    });

module.exports = mongoose.model('subscription', subscriptionSchema)