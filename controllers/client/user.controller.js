const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const generateHelper = require("../../helpers/generate")
const sendmailHelper = require("../../helpers/sendmail");

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

    const user = await User.findOne({
        email: email,//tìm kiếm xem trong user có bản ghi anof có email giống email người ta nhập không
        deleted: false
    });

    if(!user){
        res.flash("error","Email không tồn tại!");
        res.redirect("back");
        return ;
    }
    //lưu thông tin cần thiết để lấy lại mật khẩu vào database
    const otp = generateHelper.generateRandomNumber(8);//lấy ramdom 6 số
    
    const objectForgotPassword = {//tạo ra 1 object mới để lưu accs thông tin rồi sau đó lưu vào database
        email: email,
        otp: otp,
        expireAt: Date.now()//nếu chỉ để nhưu anyf thì nó sẽ lấy theo trong model
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);//lưa lại vào trong database
    await forgotPassword.save();

    //Nếu tồn tại email này thì chúng ta sẽ gửi mã OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút`;
    sendmailHelper.sendmail(email,subject,html);
    
    res.redirect(`/user/password/otp?email=${email}`);//thêm email vào để dùng query lấy ra
};

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) =>{
    const email = req.query.email;//do vừa gắn email lên link nên ta có thể dùng query để lấy ra

    res.render("client/pages/user/otp-password",{
        pageTitle:"Nhập mã OTP",
        email: email
    });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) =>{
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({//tìm xem có bản ghi nào giống email lẫn mã otp trong database không
        email: email,
        otp: otp
    });

    if(!result){//nếu không có bản ghi phù hợp
        req.flash("error","mã OTP không hợp lệ");
        res.redirect("back");
        return ;
    }

    const user = await User.findOne({
        email: email
    });//tìm ra user qua email trong database
    //lúc này quên mật khẩu tưc slaf chưa đăng nhập,nên trong cookie chưa có token User
    res.cookie("tokenUser",user.tokenUser);//cần phải lấy token và gửi kèm nên lúc đổi mật khẩu để có thể check chính xác tránh có người hack
    //đổi mật khẩu sẽ gửi kèm nên token user, token lên đây là để khi đổi mật khẩu,biết rõ được đnag đổi mật khẩu cho cái gì
    res.redirect("/user/password/reset");
};

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) =>{
    res.render("client/pages/user/reset-password",{
        pageTitle: "Đổi mật khẩu",
    });
};

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) =>{
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;//lấy ra token của người nhập mới vừa đưa lên
    //đối với tokenUser này thì ông ấy muốn đổi lại mật khẩu là password này
    await User.updateOne({
        tokenUser: tokenUser//tìm vào tài khoản người dùng có token user giống với token user chúng ta gửi lên
    },{
        password: md5(password),//thông quan tokenuser update mật khẩu mới
    });
};


 