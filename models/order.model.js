const mongoose = require("mongoose");
//role là các nhóm quyền(đây là model các nhóm quyền)
const orderSchema = new mongoose.Schema({
    //user_id: String,//lưu id của người đăng nhập
    cart_id: String,//nếu chưa đăng nhập thì phải lưu id của giỏ hàng
    userInfo: {//thông tin người đặt(bắt họ nhập vào)
        fullName: String,
        phone: String,
        address: String
    },
    products: [
        {
            product_id: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number,
        }
    ],
    deleted: {
        type: Boolean,
        default: false// gán cho các sản phẩm mới nhập đều có giá trị false=>thì lọc mới lấy được item
    },
    deletedAt: Date//cho biết thời gian xóa sản phẩm
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});
const Order = mongoose.model("Order",orderSchema,"orders");//tham số thứ 3 là tên colection trong database//

module.exports = Order;