const express = require("express");
const { login, signup,getMe, logout,getAllUsers } = require("../controllers/authControllers");
const protect=require('../middleware/protect.js')
const router = express.Router();

// Match your current frontend contract
router.post("/login", login);  
router.post("/signup", signup);  
router.post("/logout",logout);
router.get('/me',protect, getMe);
router.get("/",protect,getAllUsers)
module.exports = router;
