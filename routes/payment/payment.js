require('dotenv').config()
const path = require("path");
const request = require("request")
const shortid = require("shortid");
const Razorpay = require("razorpay");


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID_TEST,
    key_secret: process.env.RAZORPAY_KEY_SECRET_TEST,
});



const makePayment = async (req, res) => {
    const payment_capture = 1;
    const amount = 1;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log(error);
        res.json(500).send("Payment Error" + error)
    }
}

const capturePayment = async (req, res) => {
    const paymentID = req.query.id
    console.log(paymentID)
    console.log(`https://${process.env.RAZORPAY_KEY_ID_TEST}:${process.env.RAZORPAY_KEY_SECRET_TEST}@api.razorpay.com/v1/payments/${paymentID}`)
    try{
        return request({
            method: "GET",
            url: `https://${process.env.RAZORPAY_KEY_ID_TEST}:${process.env.RAZORPAY_KEY_SECRET_TEST}@api.razorpay.com/v1/payments/${paymentID}`,
            form: {
                amount: 1 * 100,
                currency: "INR"
            },
        },
        async function(err, response, body){
            console.log('Payment Data:', JSON.parse(response.body));
            if(err){
                return res.status(500).json({
                    message: "Something Error"
                })
            }
            return res.status(200).json(body)
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    makePayment,
    capturePayment
}