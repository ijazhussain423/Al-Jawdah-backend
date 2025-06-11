import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/userRoutes.js';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://al-jawdah-herb.netlify.app/" }));

// MongoDB Connection
mongoose.connect(process.env.DB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.set('transporter', transporter); // Make transporter available in routes

// Routes
app.use("/api", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));