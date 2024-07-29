const Cart = require("../../models/cart.model");

module.exports.cartId = async(req,res,next) =>{
   
    if(!req.cookies.cartId){//kiểm tra xem trong cookie đã lưu id của giỏi hàng chưa
        //Tạo giỏ hàng
        const cart = new Cart();//tạo ra 1 giỏ hàng rỗng
        await cart.save();//lưu giỏ hàng vào database=>sẽ tạo ra 1 id
        
        const exportsCookie = 365 * 24 * 60 * 60 * 1000;//do khi tạo bth biến cartId sẽ lưu ở dạng session(tắt máy tính là mất) nên ta cần cài thời gian cho nó để biết khi nào mất
        res.cookie("cartId",cart.id,{
            expires: new Date(Date.now() + exportsCookie) //cài đặt thời gian để nó tự xóa biến cartId khi đến hạn
        });//lưu id của giỏ hàng vào trong cookies
    }else{

    }
    next();
}