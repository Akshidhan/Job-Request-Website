import type { NextFunction, Request, Response } from 'express';
const express = require('express');
require('dotenv').config();
const connectDB = require('./util/db');

// Import routes
const authRoutes = require("./routes/Auth.route");
const jobRequestRoutes = require("./routes/JobRequest.route");

connectDB();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get('/api/health', (req: Request, res: Response) => {
  res.send('Health check successful!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRequestRoutes);