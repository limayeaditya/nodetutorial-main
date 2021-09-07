const Advertisement = require('../../models/advertisement')
const User = require('../../models/user')
const addInterestedBuyer = async (req,res)=>{
    try {
        const buyer_id = req.user.id
        let property_id = req.query.id;
        console.log(buyer_id)
        //console.log(await User.fo)
        if(await User.updateOne({
            _id: buyer_id
        },{
            $push: {
                contacted_ads: property_id
            }
        }) && await Advertisement.updateOne({
                _id: property_id
            }, {
                    $push :{
                            interested: buyer_id
                    }    
            })) {
                
            res.status(200).json({
                message: `advertisement ${property_id} updated successfully`
            });
        }
        

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}
module.exports = {
    addInterestedBuyer
}