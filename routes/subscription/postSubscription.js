const User = require('../../models/user')
const Subscription = require('../../models/subscription')
const uuid = require('uuid');
const moment = require('moment')
const postSubscription = async (req,res)=>{
    try {
        
        const {
            payment_type,
            amount,
            payment_details : {
                card_number,
                VPA,
            }
        } = req.body;
        
        if (await User.findOne({
                email: req.user.email
            }) == null) {
            res.status(400).json({
                error: "This author does not exists."
            })
        } else {
            const user = await User.findOne({
                email : req.user.email
            })
            if(user.is_subscribed == true){
                res.status(401).json({
                    message : `${req.user.email} already subscribed`

                })
            }
            else{
                const subscription = await Subscription.create({
                    _id: uuid.v4(),
                    author: req.user.email,
                    payment_type,
                    amount,
                    subscription_date : moment().format("dddd, MMMM Do YYYY").toString(),
                    expiry_date : moment().add(12,'M').format("dddd, MMMM Do YYYY").toString(),
                    payment_details : {
                        card_number,
                        VPA
                }
                });
                await User.updateOne({
                    email: req.user.email
                },{
                    is_subscribed : true
                })
                res.status(201).json({
                    message: ` ${req.user.email} subscribed successfully`,
                    id: subscription.id,
                    subscription_date :subscription.subscription_date,
                    expiry_date :subscription.expiry_date
                });
                
            }
            }
        
            

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    postSubscription
}