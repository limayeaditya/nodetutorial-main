const Advertisement = require('../../models/advertisement')
const User = require('../../models/user')
const uuid = require('uuid');
const moment = require('moment');

const postAdvertisement = async (req,res) => {
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
            interested,
            image

        } = req.body;

 
        if (await User.findOne({
                email: req.user.email
            }) == null) {
            res.status(400).json({
                error: "This author does not exists."
            })
        } else {
            const user = await User.findOne({
                email : req.user.email
            })
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
                is_approved: false,
                interested,
                author_details: {
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,
                    role: user.role

                },
                author_email: user.email,
                image,
                posted_on: moment().format("dddd, MMMM Do YYYY").toString()
            });
            
            
            res.status(201).json({
                message: "advertisement created successfully",
                id: advertisement.id,
                advertisement
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    postAdvertisement
}