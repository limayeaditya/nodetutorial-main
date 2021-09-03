const User = require('../../models/user');

const updateProfile = async (req,res)=>{
    try {

        if (req.body.email) {
             if (await User.findOne({
                    email: req.body.email
                })) {
                    console.log("old and new");
                res.status(400).json({
                    error: "This email is already taken."
                });
            }

            return;
        }
        console.log('HEYYLO');

        const user = await User.findOne({
            email: req.body.email
        });
        const {
            email = user.email, fullname = user.fullname, mobile = user.mobile
        } = req.body;

        if (await User.updateOne({
                email: req.user.email
            }, {
                email,
                fullname,
                mobile,
            })) {
            res.status(200).json({
                message: "User updated successfully."
            });
        } else {
            res.status(500).json({
                error: "Internal server error. Try again later."
            });
            return;
        }

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    updateProfile
}