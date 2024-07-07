const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();// Import dotenv to load environment variables from a .env file

const app = express();
app.use(express.json());// Use middleware to parse JSON bodies in requests

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB).then(() => console.log('DATABASE CONNECTED'));
// Import the user router
const userRouter=require('./Routes/userRoute')
app.use('/api',userRouter)
// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => console.log(`SERVER RUNNING PORT: ${PORT}`));
