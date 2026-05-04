const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Tesseract = require('tesseract.js');

// Helper for fuzzy string matching (Levenshtein Distance)
const getSimilarity = (str1, str2) => {
  const s1 = str1.toUpperCase().replace(/[^A-Z]/g, '');
  const s2 = str2.toUpperCase().replace(/[^A-Z]/g, '');
  let longer = s1, shorter = s2;
  if (s1.length < s2.length) { longer = s2; shorter = s1; }
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

// @route   POST api/auth/register
// @desc    Register user with mandatory ID verification
// @access  Public
router.post('/register', upload.single('idCard'), async (req, res) => {
  const { name, uniqueId, password, college } = req.body;

  try {
    if (!name || !uniqueId || !password || !college) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // New rule: Student ID must start with UU
    if (!uniqueId.toUpperCase().startsWith('UU')) {
      return res.status(400).json({ msg: 'Invalid Student ID. It must start with "UU" (e.g., UU12345)' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload your college ID card' });
    }

    // 1. Run OCR Verification BEFORE signup
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    const strictCleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Verification Logic (ONLY checking for Student ID)
    const hasStudentId = strictCleanText.includes(uniqueId.toUpperCase().replace(/[^A-Z0-9]/g, ''));

    if (!hasStudentId) {
      console.log('Verification Failed: ID mismatch. Expected:', uniqueId, 'in text');
      return res.status(400).json({ msg: `Registration failed: Student ID (${uniqueId}) not detected on the uploaded ID card. Please ensure the card is clear.` });
    }

    // Check for existing user
    let user = await User.findOne({ uniqueId });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create User (Auto-verified if ID matches)
    user = new User({
      name,
      uniqueId,
      password,
      college: college || 'United University',
      idCardImageUrl: req.file.path,
      isVerified: true,
      verificationStatus: 'approved'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        college: user.college,
        uniqueId: user.uniqueId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            uniqueId: user.uniqueId, 
            college: user.college, 
            isVerified: user.isVerified, 
            verificationStatus: user.verificationStatus 
          } 
        });
      }
    );
  } catch (err) {
    console.error('Registration/OCR Error:', err);
    res.status(500).send('Registration failed due to verification error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { uniqueId, password } = req.body;

  try {
    // Basic validation
    if (!uniqueId || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    let user = await User.findOne({ uniqueId });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        college: user.college,
        uniqueId: user.uniqueId
      }
    };

    // Sign Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, uniqueId: user.uniqueId, college: user.college, isVerified: user.isVerified, verificationStatus: user.verificationStatus } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
