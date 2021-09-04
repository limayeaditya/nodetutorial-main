const Subscription = require('../../models/subscription')
const getSubscription = async (req,res)=>{
    try {
        const subscription = await Subscription.find({
            author: req.user.email
        }).sort();
        
        res.status(200).json({
            subscription
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    getSubscription
}