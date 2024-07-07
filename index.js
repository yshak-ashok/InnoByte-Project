const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB).then(() => console.log('DATABASE CONNECTED'));

const userRouter=require('./Routes/userRoute')
app.use('/api',userRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER RUNNING PORT: ${PORT}`));
