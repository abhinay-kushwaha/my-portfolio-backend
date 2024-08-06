const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Your Gmail address
    pass: process.env.EMAIL_PASS    // Your app-specific password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Define the recipient email address directly in the code
const RECEIVER_EMAIL = 'your-receiving-email@gmail.com';

// Route to handle form submission
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Log the incoming request data
  console.log('Received form data:', { name, email, phone, message });

  // Validate input data
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,        // Sender's email address
    to: RECEIVER_EMAIL,                 // Recipient's email address (hardcoded)
    subject: 'New Contact Form from Your Portfolio',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ success: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
