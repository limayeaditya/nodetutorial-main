const Advertisement = require('../../models/advertisement')
const deleteAdvertisement_Admin = async (req,res)=>{
    try {
        let _id = req.query.id;
        const role = req.user.role
        if(role == "admin"){
            if (!(_id)) {
                res.status(400).json({
                    error: "advertisement id is required."
                });
            }
            if (await Advertisement.findOne({
                    _id
                }) == null) {
                res.status(400).json({
                    error: "This advertisement does not exists."
                })
            } else {
                await Advertisement.deleteOne({
                    _id
                });
    
                res.status(201).json({
                    message: "advertisement deleted successfully",
                });
            }
    
        }else{
            res.status(403).json({
                message: "Access denied.",
            });
        }
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    deleteAdvertisement_Admin
}