const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const changepassword = async (req,res)=>{
    try {
        const {
            old_password,
            new_password
        } = req.body;
        if (!(old_password && new_password)) {
            res.status(400).json({
                error: "Old password and new password is required."
            });
        }

        const user = await User.findOne({
            email: req.user.email
        });

        if (user && (await bcrypt.compare(old_password, user.password))) {
            const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
            const encrypted_password = await bcrypt.hash(new_password, salt);
            if (await User.updateOne({
                    email: req.user.email
                }, {
                    password: encrypted_password
                })) {
                res.status(200).json({
                    message: `Password updated for user: ${req.user.email}`
                });
            } else {
                res.status(500).json({
                    error: "Internal Error."
                });
            }

        } else {
            res.status(403).json({
                error: "Email or password is incorrect"
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}
module.exports = {
    changepassword
}