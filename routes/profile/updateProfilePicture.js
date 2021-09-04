const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, callback) {
        callback(null, uuid.v4() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, callback) => {
        const file_types = /jpeg|jpg|png/;
        const extname = file_types.test(path.extname(file.originalname).toLowerCase());
        const mimetype = file_types.test(file.mimetype);
        if (extname && mimetype) {
            return callback(null, true);
        } else {
            return callback('Only jpg, jpeg and png images with max size 1 MB is allowed.')
        }
    }
}).single('profile-picture');
const updateProfilePicture = async (req,res)=>{
    await upload(req, res, async (error) => {
        if (error) {
            return res.status(500).json({
                error
            });
        } else {
            try {
                await User.updateOne({
                    email: req.user.email
                }, {
                    profile_picture: req.file.path
                });
            } catch (error) {
                return res.status(500).json({
                    error: error.message
                });
            }
            res.status(200).json({
                message: "Profile picture updated successfully."
            });
        }
    });
}

module.exports = {
    updateProfilePicture
}