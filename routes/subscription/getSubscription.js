const moment = require('moment')
const Subscription = require('../../models/subscription')
const getSubscription = async (req,res)=>{
    try {
        const subscription = await Subscription.find({
            author: req.user.email
        }).sort();
        var today = moment().format("dddd, MMMM Do YYYY")
        var expiry_date = moment(subscription[1].expiry_date).format("dddd, MMMM Do YYYY")
        //Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. 
        //moment construction falls back to js Date(), which is not reliable across all browsers and versions.
        //Some format error yet to be fixed  
        if(moment(today).isAfter(expiry_date)){
            await User.updateOne({
                email: req.user.email
            },{
                is_subscribed : false
            })
            res.status(401).json({
                message: "Your subscription has expired."
            })
            
        }else{
            console.log()
            res.status(200).json({
            subscription
        });
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