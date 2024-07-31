//check xem người dùng có nhập sai hay không nhập gì không,nếu không nhập thì không chạy xuống next() từ đó không chạy xuống code controller
module.exports.registerPost=(req,res,next)=>{//có thêm biến next để nếu thỏa mãn thì có thể next sang bước tiếp theo tiếp theo luôn
    if(!req.body.fullName){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","vui lòng nhập họ tên");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }
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

module.exports.forgotPasswordPost = (req,res,next)=>{//có thêm biến next để nếu thỏa mãn thì có thể next sang bước tiếp theo tiếp theo luôn
    if(!req.body.email){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","vui lòng nhập email");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }
    next();
}

module.exports.resetPasswordPost = (req,res,next)=>{//có thêm biến next để nếu thỏa mãn thì có thể next sang bước tiếp theo tiếp theo luôn
    if(!req.body.password){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","vui lòng nhập mật khẩu");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }

    if(!req.body.confirmPassword){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","vui lòng xác nhận mật khẩu");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }

    if(req.body.password != req.body.confirmPassword){//check xem đã nhập tiêu đề chưa,chưa nhập bắt phải nhập (đây là validate)
        req.flash("error","Mật khẩu không khớp");//hiện lên thông báo
        res.redirect("back");//ngăn cho nó chạy sang trang khác,bắt phải nhập
        return ;//nếu chưa nhập thì bắt nhập;return ở đây ngăn cho nó chạy xuống các đoạn code phía dưới ,đến khi nào nhập thì thôi
    }
    next();
}

