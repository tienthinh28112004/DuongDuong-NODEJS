const mongoose = require("mongoose");

//đây là model hàng hóa
const cartSchema = new mongoose.Schema({
    user_id: String,//lưu vào id của người đưa sản phẩm vào giỏ hàng
    products: [
        {
            product_id : String,//lưu id của sản phẩm
            quantity: Number,//lưu số lượng sản phẩm muốn mua
        }
    ]
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});

const Cart = mongoose.model("Cart", cartSchema, "carts");//tham số thứ 3 là tên colection trong database//

module.exports = Cart;