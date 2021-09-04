const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginUser = async (req,res)=>{
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
                        email: user.email
                        
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
}

module.exports = {
    loginUser
}