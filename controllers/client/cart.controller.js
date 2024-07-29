const Cart = require("../../models/cart.model");

//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId; //lưu lại id của sản phẩm
    const quantity = parseInt(req.body.quantity); //lấy ra số lượng sản phẩm
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    }); //tìm là giỏ hàng có id giống với cartId(cart này có 2 phần tử là id và object products)

    const existProductInCart = cart.products.find(item => item.product_id == productId); //từ biến cart chỏ đến object products từ đấy kiểm tra xem trong cart có obeject này có id chưa

    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;
        //hàm update lại biến
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        },{
            $set: {
                "products.$.quantity":quantityNew //update lại biến products.quantity
            }
        }
        );
        //hàm hết update lại biến
    } else {
        const objectCart = { //tạo 1 object để thông qua id của giỏ hàng, lưu vào trong giỏ hàng
            product_id: productId,
            quantity: quantity
        };

        await Cart.updateOne({
            _id: cartId
        }, {
            $push: {
                products: objectCart
            } //cập nhật 1 object mới cho product trong model(cập nhật sản phẩm mới vào trong giỏ hàng(thông qua id))
        });

    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");

    res.redirect("back");
}