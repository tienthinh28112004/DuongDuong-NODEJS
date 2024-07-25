module.exports.loginPost = (req,res,next)=>{//có thêm biến next để nếu thỏa mãn thì có thể next sang bước tiếp theo tiếp theo luôn
    if(!req.body.email){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","vui lòng nhập email");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }
    if(!req.body.password){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","vui lòng nhập mật khẩu");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }
    next();
}