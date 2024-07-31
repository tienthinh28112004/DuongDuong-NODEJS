const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");

router.get("/register",controller.register);//phương thức get gửi lên phương thức post để bảo mật

router.post("/register",validate.registerPost,controller.registerPost);//validate đảm bảo người nhập phải nhập thông tin

router.get("/login",controller.login);

router.post("/login",validate.loginPost,controller.loginPost);//validate đảm bảo người nhập phải nhập thông tin

router.get("/logout",controller.logout);

router.get("/password/forgot",controller.forgotPassword);

router.post("/password/forgot",validate.forgotPasswordPost,controller.forgotPasswordPost);

module.exports = router;