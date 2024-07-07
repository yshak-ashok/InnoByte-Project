const express = require('express');
const userRouter = express();
const userController = require('../controllers/userController');
const tokenAuthentication = require('../middlewares/auth')
// Routes
userRouter.post('/signup', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/profile',tokenAuthentication,userController.profile)
userRouter.get('/confirm', userController.confirmEmail);

module.exports = userRouter;
