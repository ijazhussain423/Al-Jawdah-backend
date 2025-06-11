import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();
// /api/customer
router.post("/customer", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  const transporter = req.app.get('transporter');

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Save to database
    const newUser = new User({ firstName, lastName, email, message });
    await newUser.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.AUTHOR_EMAIL,
      subject: 'New Customer Query',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Received at: ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Query submitted successfully" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;