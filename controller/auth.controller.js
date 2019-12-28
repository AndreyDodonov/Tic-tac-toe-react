const errorHandler = require('../utils/errorHandler');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

module.exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400). json({errors: errors.array(), message: 'incorrect registration data'})
        }

        const {email, password} = req.body;
        const candidate = await User.findOne({email:email});
        if (candidate) {
            return res.status(400).json({message: 'email is busy ((. Try another'})
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User ({email, password: hashedPassword});

        await user.save();
        res.status(201).json({message: 'user was created '});

    } catch(e) {
        errorHandler(res, e)
    }
};

module.exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400). json({errors: errors.array(), message: 'incorrect login data'})
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            res.status(400).json({message: "such e-mail was not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({message: "Passwords do not match"})
        }

        const token = jwt.sign(
            {userId: user.id},  // можно добавлять user.name и т.д
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );

        await res.json({token, userId: user.id})

    } catch(e) {
        errorHandler(res, e)
    }
};

