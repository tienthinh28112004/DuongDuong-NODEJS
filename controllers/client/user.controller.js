const md5 = require("md5");
const User = require("../../models/user.model");

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