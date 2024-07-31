const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");

router.get("/register",controller.register);//phương thức get gửi lên phương thức post để bảo mật

router.post("/register",validate.registerPost,controller.registerPost);//validate đảm bảo người nhập phải nhập thông tin

router.get("/login",controller.login);

router.post("/register",validate.loginPost,controller.loginPost);//validate đảm bảo người nhập phải nhập thông tin

module.exports = router;