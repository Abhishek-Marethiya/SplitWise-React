const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (userId, res) => {

	
  // Create JWT
  const token = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET,   // secret from .env
    { expiresIn: "7d" }       // token expiry
  );
console.log("Generated Token:",token);

  // Store token in HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,            // not accessible via JS
    secure: process.env.NODE_ENV === "production", // only https in prod
    sameSite: "strict",        // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });

  return token;
};

module.exports = generateTokenAndSetCookie
