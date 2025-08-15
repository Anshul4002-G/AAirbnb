const express = require('express');
const authRouter = express.Router();

const authController = require('../controller/auth');

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/logout", authController.getLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);

module.exports=authRouter;