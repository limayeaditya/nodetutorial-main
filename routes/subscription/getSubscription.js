const moment = require('moment')
const Subscription = require('../../models/subscription')
const User = require('../../models/user')
const getSubscription = async (req,res)=>{
    try {
        const subscription = await Subscription.find({
            author: req.user.email
        }).sort();
        var today = moment()
        var expiry_date = moment((subscription[0].expiry_date).toISOString)
        console.log(today,expiry_date)
        const user = await User.findOne({email:req.user.email})
        if(moment(today).isBefore(expiry_date)){
            await User.updateOne({
                email: req.user.email
            },{
                is_subscribed : false
            })
        }
            if(user.is_subscribed){
                res.status(200).json({
                    subscription
                });
            }else{
                res.status(401).json({
                    message: "Your subscription has expired."
                })
            }
        
  
        
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    getSubscription
}