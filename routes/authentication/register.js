const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const registerUser =  async (req,res) => {
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
}

module.exports = {
    registerUser
}