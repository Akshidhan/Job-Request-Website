import type { Request, Response } from "express";
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Login
const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

// Register
const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        return res.status(201).json({ message: "User created successfully", token: jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            }, process.env.JWT_SECRET, { expiresIn: "1h" }) });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

module.exports = {
    login,
    register
}