const moment = require('moment')
const Subscription = require('../../models/subscription')
const User = require('../../models/user')
const getSubscription = async (req,res)=>{
    try {
        const subscription = await Subscription.find({
            author: req.user.email
        }).sort();
        // console.log(today,expiry_date)
        const user = await User.findOne({email:req.user.email})
        
        if(subscription.length > 0){
            var expiry_date = moment(subscription[0].expiry_date,"dddd, MMMM Do YYYY, h:mm:ss zz")
            if(moment().isAfter(expiry_date,'year')){
                await User.updateOne({
                    email: req.user.email
                },{
                    is_subscribed : false
                })
                res.status(400).json({
                    message:"Your subscription has expired."
                })
            }else{
                res.status(200).json({
                    subscription
                });
            }

        }else{
            res.status(401).json({
                message: "Please subscribe to continue."
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