const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  
  try {
    const token = req.cookies.jwt;
  console.log("token in protected route",token);
  
    if (!token) return res.status(401).json({ error: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODEd token: ",decoded);
    
    req.user = await User.findById(decoded.userId).select('-password');
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = protect;