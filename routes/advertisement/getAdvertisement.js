const getAdvertisement = async (req,res)=>{
    try {
        const {
            _id
        } = req.body;

        
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

            res.status(200).json({
                advertisement
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