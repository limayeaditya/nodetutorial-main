const Advertisement = require('../../models/advertisement')

const getMyAdvertisements = async (req,res) =>{
    try {
        const advertisements = await Advertisement.find({
            author_email: req.user.email
        }).sort();
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
    getMyAdvertisements
}