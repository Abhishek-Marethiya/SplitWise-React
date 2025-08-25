const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateTokenAndSetCookie=require('../utils/generateToken');
// helper to shape the user like JSON-server (no password, include `id`)
const shapeUser = (u) => ({
  id: u._id.toString(),
  name: u.name,
  email: u.email,
});

exports.login = async (req, res) => {
    try {

      
		const { email, password } = req.body;
          console.log("inside login controller");
          console.log(email,password);
          
		const user = await User.findOne({ email });
    
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!email || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);
		res.status(200).json(user);
        
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character",
      });
    }
    console.log("Inside signup controller..");
    
    const exists = false;
    console.log(exists);
    
    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    if(user){
        generateTokenAndSetCookie(user._id, res);
        console.log("After Generating Token...");
        
      await user.save();
      console.log("After Saving Data in DB");
      
      res.status(201).json(user);
    }
  } catch (err) {
    console.error("createUser error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.logout=async(req,res)=>{
    try {
		const token=req.cookies.jwt;
		console.log(token);
		
		res.cookie("jwt", "", { maxAge: 0 });
		// res.clearCookie("token");
		
		res.status(200).json({ message: "Logged out successfully" });    
		
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

exports.getMe=async (req, res) => {
  console.log("Ok");
  
	try {
		const user = await User.findById(req.user._id).select("-password");  //user detail excluding password
		res.status(200).json(user); //Sends the retrieved data as a JSON response to the client.
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

exports.getAllUsers=async(req,res)=>{
  try{
    const users=await User.find();
    res.status(200).json(users);
  }catch(error){
     console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
  }
}