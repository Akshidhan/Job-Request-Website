import type { Request, Response } from 'express';
const express = require('express');
require('dotenv').config();
const connectDB = require('./util/db');

// Import routes
const authRoutes = require("./routes/Auth.route");
const jobRequestRoutes = require("./routes/JobRequest.route");

connectDB();

const app = express();
const PORT = 3000;

app.get('/api/health', (req: Request, res: Response) => {
  res.send('Health check successful!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRequestRoutes);