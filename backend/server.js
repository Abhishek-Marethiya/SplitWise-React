const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');
const cookieParser=require("cookie-parser");
const app=express();
const authRouter=require('./routes/authRoutes')
const groupRoutes=require('./routes/groupRoutes');
const expenseRoutes=require('./routes/expenseRoutes')
const connectDB =require("./utils/connectDB")
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.SERVER_PORT || 3000;

app.use(cors({
	origin: 'http://localhost:5173', // your frontend's URL
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true // allow cookies and credentials
}));


app.use('/api/auth',authRouter)
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);


connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`✅ Server running on port ${PORT}`);
	});
}).catch(err => {
	console.error("DB Connection Failed:", err.message);
});


