const express = require('express');
const User = require('../models/User');
const { hashPassword } = require('../utils/password');


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


const signup = async (req, res) => {
    try {
        const { name, usernName, email, password, phoneNumber, avatarProfile } = req.body;

        if (!name || !userName || !email || !password || !avatarProfile) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" })
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number" })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({ name, userName, email, password: hashedPassword, phoneNumber, avatarProfile });
        await user.save();

        const accessToken = generateAccessToken({
            userId: user._id,
            email: user.email,
            tokenVersion: user.tokenVersion
        });
        const refreshToken = generateRefreshToken({
            userId: user._id,
            email: user.email,
            tokenVersion: user.tokenVersion
        });

        user.refreshToken = refreshToken;
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            signed: true
        }

        const refreshCookieOptions = {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }

        const accessToken = generateAccessToken({
            userId: user._id,
            email: user.email,
            tokenVersion: user.tokenVersion
        });
        const refreshToken = generateRefreshToken({
            userId: user._id,
            email: user.email,
            tokenVersion: user.tokenVersion
        });

        user.refreshToken = refreshToken;
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            signed: true
        }

        const refreshCookieOptions = {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}




const logout = async (req, res) => {
    try {
        const userId = req.user?.id;

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax')
        };

        res.clearCookie('token', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        if (userId) {
            await User.updateOne({ _id: userId }, { $set: { refreshToken: null, tokenVersion: (user.tokenVersion || 0) + 1 } });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


export { signup, login, logout };