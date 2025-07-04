const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require("crypto");




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify(function(error, success) {
  if (error) {
    console.error('Nodemailer config error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Quiz App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify your Quiz App account",
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
}

// // REGISTER
// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   const hash = await bcrypt.hash(password, 10);
//   try {
//     const user = await User.create({ name, email, password: hash });
//     res.json({ msg: "User registered" });
//   } catch {
//     res.status(400).json({ msg: "Email already exists" });
//   }
// });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await user.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.isVerified) return res.json({ message: "Already verified" });

  if (user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Account verified!" });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "Invalid email" });

  if (!user.isVerified) {
    return res.status(403).json({ error: "Please verify your email first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});


module.exports = router;
