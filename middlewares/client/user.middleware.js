const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) =>{
    if(req.cookies.tokenUser){//nếu đăng nhập thì sẽ có 1 tokenUser được lưu vào cookie ,ở đây ta lấy nó ra
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,//lấy ra thông tìn tài khoản có tokenUser giống với tokenUser đăng nhập được lưu trên cookie
            deleted:false,
            status: "status"
        }).select("-password");//lấy ra tất cả thông tin trừ password

        if(user){
            res.locals.user = user;//nếu đăng nhập thì chuyển biến user thành biến toàn cục
        }
    }

    next();//người ta đăng nhập thì mình lấy được thông tin,còn người ta không đăng nhập thì vẫn cho vào các trang khác bình thường
}