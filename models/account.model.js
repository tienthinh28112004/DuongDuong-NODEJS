const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema({
    fullName: String, 
    email: String,
    password: String,
    token: {
        type: String,
        default:generate.generateRandomString(20)
    },// token là 1 cái string ramdom
    phone: String,
    avatar: String,
    role_id: String,//quyền của cái tài khoản này
    status: String,
    deleted: {
        type: Boolean,
        default: false// gán cho các sản phẩm mới nhập đều có giá trị false=>thì lọc mới lấy được item
    },
    deletedAt: Date//cho biết thời gian xóa sản phẩm
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});
const Account = mongoose.model("Account",accountSchema,"accounts");//tham số thứ 3 là tên colection trong database//

module.exports = Account;