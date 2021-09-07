const User = require('../../models/user')
const getAllUsers = async (req, res) => {
    try {
        const role = req.user.role
        if (role == "admin") {
            const users = await User.find({
                role:"user"
            }).sort();
            res.status(200).json({
                users
            });
        } else {
            res.status(403).json({
                message: "Access denied."
            });
        }

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    getAllUsers
}