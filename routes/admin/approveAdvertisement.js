const Advertisement = require('../../models/advertisement')
const User = require('../../models/user')
const approveAdvertisement = async (req,res)=>{
    try {
        let _id = req.query.id
        let is_approved = req.query.approval
        const role = req.user.role
        if (role == "admin"){
            if (!_id) {
                res.status(400).json({
                    error: "ID is required."
                });
            }else{
                if (await Advertisement.updateOne({
                    _id
                }, 
                {
                    is_approved
                }   
                )) {
                res.status(200).json({
                    message: `advertisement ${_id} approved successfully`
                });
            }
            }
    
            
        }else{
            res.status(403).json({
                message: "Access denied."
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}
module.exports = {
    approveAdvertisement
}