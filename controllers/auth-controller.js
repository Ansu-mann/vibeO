const mongoose = require('mongoose');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //checking if the user is already present in the DB
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists either with same username or email! Please try with a different username or email'
            })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newlyCreatedUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        if (newlyCreatedUser) {
            return res.status(201).json({
                success: true,
                message: 'User created successfully!',
            })
        } else {
            return res.status(400).json({
                success: true,
                message: 'Unable to regiter user! Please try again',
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        })
    }
}

// login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User doesn't exist!`
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(404).json({
                success: false,
                message: 'Invalid credentials!'
            })
        }

        // create a token that contains user information (jwt)
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        })

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        })
    }
}


module.exports = { loginUser, registerUser }