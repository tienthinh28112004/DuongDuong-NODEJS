const mongoose = require("mongoose");

//model giúp lấy lại mật khẩu
const forgotPasswordSchema = new mongoose.Schema({
    email: String,//lưu email của người dùng
    otp: String,//lưu mã otp
    expireAt:{
        type: Date,
        expires: 180 //để 180 ở đây thì sau 180s nó sẽ hết hạn
    },//thời gian hết hạn của mã otp
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");//tham số thứ 3 là tên colection trong database//

module.exports = ForgotPassword;