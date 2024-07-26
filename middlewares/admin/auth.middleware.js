const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

module.exports.requireAuth = async(req, res, next) => {
    if(!req.cookies.token){//req.cookies sẽ lấy ra 1 object các cái mình gửi lên cookies,từ đó chấm vào token là lấy được token
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
        const user = await Account.findOne({token: req.cookies.token}).select("-password");//nếu có lấy ra được thì không cần phải lấy key pasword
        if(!user){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`); 
        }else{
            const role = await Role.findOne({
                _id: user.role_id
            }).select("title permissions");//trả vầ title và permission
            res.locals.user = user;//trả lại biến toàn cục user của tài khoản đăng nhập
            res.locals.role = role;
            next();
        }
    }
}