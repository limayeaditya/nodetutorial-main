const multer = require('multer');
const path = require('path');
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
const updateProfilePictureUrl = async() => {
    try {
        const {
            profile_picture
        } = req.body;

        if (!(profile_picture)) {
            res.status(400).json({
                error: "Profile picture is required."
            });
        }

        await User.updateOne({
            email: req.user.email
        }, {
            profile_picture
        })

        res.status(201).json({
            message: "Picture updated successfully",
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    updateProfilePictureUrl
}