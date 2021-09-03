const User = require('../../models/user');

const getMyProfile = async (req,res) =>{
    try {
        const user = await User.findOne({
            email: req.user.email
        });
        if (user) {
            res.status(200).json({
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                profile_picture: user.profile_picture,
                is_subscribed: user.is_subscribed
            })
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    getMyProfile
}