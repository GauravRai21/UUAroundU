const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
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

// @route   POST api/verify/upload
// @desc    Upload college ID for verification and run OCR rules
// @access  Private
router.post('/upload', [auth, upload.single('idCard')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload an image file (JPG/PNG)' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // 1. Run OCR
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    const normalizedText = text.toUpperCase().replace(/[\s\n]+/g, ' ');

    // 2. Detect Fields (Simple Regex)
    const hasCollege = normalizedText.includes('UNITED UNIVERSITY');
    const hasStudentId = normalizedText.includes(user.uniqueId) || (user.studentId && normalizedText.includes(user.studentId.toUpperCase()));
    const nameSimilarity = getSimilarity(user.name, normalizedText); // Checking if user name exists in OCR text

    // 3. Verification Logic
    let status = 'pending';
    let isVerified = false;
    let mismatchReasons = [];

    if (!hasCollege) {
      status = 'rejected';
      mismatchReasons.push('College name "United University" not detected');
    } else if (!hasStudentId) {
      status = 'rejected';
      mismatchReasons.push('Student ID mismatch or not found');
    } else if (nameSimilarity < 0.7) { // 70% threshold for fuzzy match in full text
      status = 'pending';
      mismatchReasons.push(`Name similarity low (${Math.round(nameSimilarity * 100)}%)`);
    } else {
      status = 'approved';
      isVerified = true;
    }

    // 4. Update User
    user.idCardImageUrl = req.file.path;
    user.verificationStatus = status;
    user.isVerified = isVerified;
    await user.save();

    res.json({ 
      msg: status === 'approved' ? 'ID Verified Automatically!' : `Verification ${status}`,
      status,
      isVerified,
      reasons: mismatchReasons,
      extractedSnippet: normalizedText.substring(0, 100) + '...' // For debugging
    });

  } catch (err) {
    console.error('OCR Error:', err);
    res.status(500).send('Verification service error');
  }
});

// @route   POST api/verify/approve/:id
// @desc    Approve user verification (Admin only - basic implementation)
// @access  Private/Admin
router.post('/approve/:id', auth, async (req, res) => {
  try {
    // Note: In a real app, check if req.user is an admin
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isVerified = true;
    user.verificationStatus = 'approved';
    await user.save();

    res.json({ msg: 'User approved', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/verify/reject/:id
// @desc    Reject user verification
// @access  Private/Admin
router.post('/reject/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isVerified = false;
    user.verificationStatus = 'rejected';
    await user.save();

    res.json({ msg: 'User rejected', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
