const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const generateHelper = require("../../helpers/generate");

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email, //tìm trong user xem có bản ghi nào giống email trên không,nếu có tức là đã có tài khaonr của email anyf còn nếu không thì cho tạo tài khoản
    });

    if (existEmail) {
        req.flash("error", "Email của bạn đã tồn tại");
        res.redirect("back");
        return ;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();//nếu chưa có thông tin tài khoản này thi mã hóa mật khẩu rồi lưu vào database

    res.cookie("tokenUser",user.tokenUser);//sau khi lưu tài khoản mới vào database thì ta sẽ có tokenUser(do model user) và ta sẽ lưu biến này vào trong database khi đăng xuất thì xóa biến anyf đi

    res.redirect("/");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(md5(password) !== user.password){//check lại xem password có giống không
        req.flash("error","Email không tồn tại");
        res.redirect("back");
        return ;
    }

    if(user.status === "inactive") {//check xem tài khoản có bị khóa không
        req.flash("error","Tài khoản đang bị khóa");
        res.redirect("back");
        return ;
    }

    res.cookie("tokenUser",user.tokenUser);//lưu token của user vào trong cookie

    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
   res.clearCookie("tokenUser");//xóa đi biến tokenUser trong cookie là đăng xuất
   res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password",{
        pageTitle: "Lấy lại mật khẩu"
    });
}
 
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await user.findOne({
        email: email,//tìm kiếm xem trong user có bản ghi anof có email giống email người ta nhập không
        deleted: false
    });

    if(!user){
        res.flash("error","Email không tồn tại!");
        res.redirect("back");
        return ;
    }
    //lưu thông tin cần thiết để lấy lại mật khẩu vào database
    const otp = generateHelper.generateRandomNumber(6);//lấy ramdom 6 số
    
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()//nếu chỉ để nhưu anyf thì nó sẽ lấy theo trong model
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);//lưa lại vào trong database
    await forgotPassword.save();
    //Nếu tồn tại email này thì chúng ta sẽ gửi mã OTP qua email


}
 