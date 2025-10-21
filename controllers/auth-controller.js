const mongoose = require('mongoose');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TokenBlackList = require('../models/TokenBlackList')

// register controller
const registerUser = async (req, res) => {
    try {
        const { username, email, fullname, password, role } = req.body;

        //checking if the user is already present in the DB
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists either with same username or email! Please try with a different username or email'
            })
        }

        // return error message for any missing field
        if(!fullname || !username || !email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields'
            })
        }

        const userNameContainsSymbols = (username) => {
            return /[^a-z0-9._]/.test(username);
        }

        const startsWithNumber = (username) => {
            return /^[0-9]/.test(username);
        }

        // only accept lowercased username
        if((username !== username.toLowerCase()) || (userNameContainsSymbols(username)) || (startsWithNumber(username))){
            return res.status(400).json({
                success: false,
                message: 'Invalid username! Please enter a valid username'
            })
        }

        // check name length
        if(fullname.length > 30){
            return res.status(400).json({
                success: false,
                message: 'Fullname must be less than 30 characters'
            })
        }
        if(fullname.length < 3){
            return res.status(400).json({
                success: false,
                message: 'Fullname must be atleast 3 characters long'
            })
        }

        // check password length
        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: 'Password must be atleast 6 characters long'
            })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newlyCreatedUser = await User.create({
            username,
            email,
            fullname,
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
                success: false,
                message: 'Unable to register user! Please try again',
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
        let user

        let { username, email, password } = req.body
        if (username) {
            user = await User.findOne({ username })
        } else if (email) {
            user = await User.findOne({ email })
        } else {
            return res.status(400).json({
                success: false,
                message: `Please provide either username or email`
            })
        }

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

// logout controller
const logout = async (req, res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        await TokenBlackList.create({token});

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully!'
        });

    }catch(error){
        console.error('Error signing out')
        res.status(500).json({
            success: false,
            message: 'Error signing out, Please try again!'
        })
    }
}


module.exports = { loginUser, registerUser, logout }