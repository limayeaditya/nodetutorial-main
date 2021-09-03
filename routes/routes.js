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

router.post('/register', validate, async (req, res) => {
    try {
        const {
            fullname,
            mobile,
            email,
            password,
            role,
            is_subscribed
        } = req.body;

        if (!(fullname && mobile && email && password)) {
            res.status(400).json({
                error: "All inputs are required."
            });
        }
        if (await User.findOne({
                email
            })) {
            res.status(400).json({
                error: "This user already exists."
            })
        }
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT))
        const encrypted_password = await bcrypt.hash(password, salt)

        const user = await User.create({
            _id: uuid.v4(),
            fullname,
            mobile,
            email,
            password: encrypted_password,
            role,
            is_subscribed
        });

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.post('/login', validate, async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        if (!(email && password)) {
            res.status(400).json({
                error: "Email and password is required."
            })
        } else {
            const user = await User.findOne({
                email
            });

            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign({
                        _id: user._id,
                        email
                        
                    },
                    process.env.APP_KEY, {
                        expiresIn: "1h",
                    }
                );
                res.status(200).json({
                    email,
                    token,
                    role: user.role
                });
            } else {
                res.status(400).json({
                    error: "Email or password is incorrect"
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: error.message
        });
    }
});

router.put('/changepassword', [validate, authenticate], async (req, res) => {
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
});


router.get('/self', authenticate, async (req, res) => {
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
});

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

router.put('/updateprofile', [authenticate, validate], async (req, res) => {
    try {

        if (req.body.email) {
            if (req.body.email == req.user.email) {
                res.status(403).json({
                    error: "Old and new email cannot be same."
                });
            } else if (await User.findOne({
                    email: req.body.email
                })) {
                res.status(400).json({
                    error: "This email is already taken."
                });
            }

            return;
        }

        const user = await User.findOne({
            email: req.body.email
        });
        const {
            email = user.email, fullname = user.fullname, mobile = user.mobile, is_subscribed = user.is_subscribed
        } = req.body;

        if (await User.updateOne({
                email: req.user.email
            }, {
                email,
                fullname,
                mobile,
                is_subscribed
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
});

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

router.post('/advertisement', [validate, authenticate], async (req, res) => {
    try {
        const {
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
            intrests

        } = req.body;

 
        if (await User.findOne({
                email: req.user.email
            }) == null) {
            res.status(400).json({
                error: "This author does not exists."
            })
        } else {
            const advertisement = await Advertisement.create({
                _id: uuid.v4(),
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
                intrests,
                author: req.user.email
            });

            res.status(201).json({
                message: "advertisement created successfully",
                id: advertisement.id
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

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
            intrests

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
                intrests    
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

router.get('/advertisements', async (req, res) => {
    try {
        const advertisements = await Advertisement.find({}).sort();
        res.status(200).json({
            advertisements
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.get('/myadvertisements', authenticate, async (req, res) => {
    try {
        const advertisements = await Advertisement.find({
            author: req.user.email
        }).sort();
        res.status(200).json({
            advertisements
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