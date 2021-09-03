require('dotenv').config();
const User = require('../models/user');
const Advertisement = require('../models/advertisement')
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authentication');
const validate = require('../middleware/validation');
const multer = require('multer');
const path = require('path');
const user = require('../models/user');
const Subscription = require('../models/subscription');

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

router.post('/register', validate, async (req,res)=>{ require('./authentication/register').registerUser(req,res)})

router.post('/login', validate, async (req, res) => { require('./authentication/login').loginUser(req,res)});

router.put('/changepassword', [validate, authenticate], async (req, res) => {require('./profile/changePassword').changepassword(req,res)});


router.get('/myprofile', authenticate, async (req, res) => { require('./profile/myProfile').getMyProfile(req,res)});

router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find({}).select('fullname email mobile -_id').sort();
        res.status(200).json({
            users
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.put('/updateprofile', [authenticate, validate], async (req, res) => { require('./profile/updateProfile').updateProfile(req,res)});

router.put('/updateprofilepicture', [authenticate, validate], async (req, res) => {
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
});

router.put('/updateprofilepictureurl', [authenticate, validate], async (req, res) => {
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
});

router.post('/advertisement', [validate, authenticate], async (req, res) => { require('./advertisement/postAdvertisement').postAdvertisement(req,res)});

router.put('/updateadvertisement', [validate, authenticate], async (req, res) => {
    try {
        const {
            _id,
            property_details : {
                property_title,
                property_type,
                description,
                n_bhk
            },
            address : {
                city,
                area_details
            },
            quoted_price,
            is_approved,
            interested

        } = req.body;
        
        if (!_id) {
            res.status(400).json({
                error: "ID is required."
            });
        }

        if (await Advertisement.updateOne({
                _id
            }, {
                property_details : {
                    property_title,
                    property_type,
                    description,
                    n_bhk
                },
                address : {
                    city,
                    area_details
                },
                quoted_price,
                is_approved,
                interested    
            })) {
            res.status(200).json({
                message: `advertisement ${_id} updated successfully`
            });
        }

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


router.delete('/advertisement', [validate, authenticate], async (req, res) => {
    try {
        const {
            _id
        } = req.body;

        if (!(_id)) {
            res.status(400).json({
                error: "advertisement id is required."
            });
        }
        if (await Advertisement.findOne({
                _id
            }) == null) {
            res.status(400).json({
                error: "This advertisement does not exists."
            })
        } else {
            await Advertisement.deleteOne({
                _id
            });

            res.status(201).json({
                message: "advertisement deleted successfully",
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/advertisements', async (req, res) => {require('./advertisement/getAdvertisements').getAdvertisements(req,res)});

router.get('/myadvertisements', authenticate, async (req, res) => {require('./advertisement/getMyAdvertisements').getMyAdvertisements(req,res)});

router.get('/advertisement', [validate, authenticate], async (req, res) => {
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
});

router.post('/subscription', [validate, authenticate], async (req, res) => {
    try {
        const {
            payment_type,
            amount,
            subscription_date,
            expiry_date,
            payment_details : {
                card_number,
                VPA,
            }
        

        } = req.body;

 
        if (await User.findOne({
                email: req.user.email
            }) == null) {
            res.status(400).json({
                error: "This author does not exists."
            })
        } else {
            const subscription = await Subscription.create({
                _id: uuid.v4(),
                author: req.user.email,
                payment_type,
                amount,
                subscription_date,
                expiry_date,
                payment_details : {
                    card_number,
                    VPA
            }
            });

            res.status(201).json({
                message: ` ${req.user.email} subscribed successfully`,
                id: subscription.id
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
router.get('/subscription', async (req, res) => {
    try {
        const subscription = await Subscription.find({}).sort();
        res.status(200).json({
            subscription
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});
router.get('/', async (req, res) => {
    res.status(200).json({
        message: "This app works"
    });
});
module.exports = router;