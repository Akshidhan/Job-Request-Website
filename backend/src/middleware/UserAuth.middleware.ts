import type { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const readCookieToken = (cookieHeader?: string) => {
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(";").map((cookie: string) => cookie.trim());
    const tokenCookie = cookies.find((cookie: string) => cookie.startsWith("token="));

    if (!tokenCookie) {
        return null;
    }

    return tokenCookie.slice("token=".length);
};

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : readCookieToken(req.headers.cookie);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { authenticateUser };