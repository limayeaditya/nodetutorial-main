const Advertisement = require('../../models/advertisement')

const getAllAdvertisements = async (req,res)=>{
    try {
        const advertisements = await Advertisement.find({}).sort();
        res.status(200).json({
            advertisements
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    getAllAdvertisements
}