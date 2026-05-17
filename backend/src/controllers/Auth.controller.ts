import type { Request, Response } from "express";
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 1000,
};

const createAuthToken = (user: { _id: unknown; email: string; name: string }) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
    );
};

const buildUserResponse = (user: { _id: unknown; name: string; email: string }) => ({
    id: user._id,
    name: user.name,
    email: user.email,
});

const clearAuthCookie = (res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
        maxAge: 0,
    });
};

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

        const token = createAuthToken(user);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: buildUserResponse(user),
        });
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
        const token = createAuthToken(user);
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: buildUserResponse(user),
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        return res.status(200).json({
            user: {
                id: user.userId,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

const logout = async (_req: Request, res: Response) => {
    try {
        clearAuthCookie(res);

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

module.exports = {
    login,
    register,
    getCurrentUser,
    logout,
}