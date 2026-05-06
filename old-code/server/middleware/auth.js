const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded.user;
    
    // Ensure uniqueId exists (for users with older tokens)
    if (!req.user.uniqueId) {
      const User = require('../models/User');
      User.findById(req.user.id).then(user => {
        if (user) req.user.uniqueId = user.uniqueId;
        next();
      }).catch(err => next());
    } else {
      next();
    }
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
