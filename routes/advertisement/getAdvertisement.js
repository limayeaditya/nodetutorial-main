const Advertisement = require('../../models/advertisement')
const User = require('../../models/user')
const getAdvertisement = async (req,res)=>{
    try {
        let _id = req.query.id;

        if (await Advertisement.findOne({
                _id
            }) == null) {
            res.status(400).json({
                error: "This advertisement does not exists."
            })
        } else {
            const advertisement = await Advertisement.findOne({
                _id
            }).sort();
            const user = await User.findOne({
                email : req.user.email
            })
            res.status(200).json({
                advertisement,
                user
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    getAdvertisement
}