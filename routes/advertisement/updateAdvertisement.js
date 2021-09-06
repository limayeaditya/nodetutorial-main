const Advertisement = require('../../models/advertisement')
const updateaAvertisement = async (req,res)=>{
    try {
        const {
            _id,
            property_details : {
                property_title,
                property_type,
                description,
                n_bhk
            },
            address : {
                city,
                area_details
            },
            quoted_price,
            is_approved,
            interested

        } = req.body;
        
        if (!_id) {
            res.status(400).json({
                error: "ID is required."
            });
        }

        if (await Advertisement.updateOne({
                _id
            }, {
                property_details : {
                    property_title,
                    property_type,
                    description,
                    n_bhk
                },
                address : {
                    city,
                    area_details
                },
                quoted_price,
                is_approved,
                interested    
            })) {
            res.status(200).json({
                message: `advertisement ${_id} updated successfully`
            });
        }

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}
module.exports = {
    updateaAvertisement
}