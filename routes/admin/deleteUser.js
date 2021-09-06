const User = require('../../models/user')
const deleteUser = async (req,res)=>{
    try {
        let _id = req.query.id;
        const role = req.user.role
        if (role == "admin") {
            if (!(_id)) {
                res.status(400).json({
                    error: "user id is required."
                });
            }
            if (await User.findOne({
                    _id
                }) == null) {
                res.status(400).json({
                    error: "This user does not exist."
                })
            } else {
                await User.deleteOne({
                    _id
                });
    
                res.status(201).json({
                    message: "user deleted successfully",
                });
            }
                
        } else {
            res.status(403).json({
                message: "Access denied."
            });
        }
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    deleteUser
}