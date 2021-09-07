const User = require('../../models/user')
const getUserById = async (req,res)=>{
    try {
        let _id = req.query.id;

        if (await User.findOne({
                _id
            }) == null) {
            res.status(400).json({
                error: "This user does not exists."
            })
        } else {
            const user = await User.findOne({
                _id
            }).sort();
            
            res.status(200).json({
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
    getUserById
}