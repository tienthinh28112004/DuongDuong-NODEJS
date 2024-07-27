const md5 = require("md5"); //nhứng thư viện md5 vào đây(thư viện này có atsc dụng mã hóa 1 string sang thành 1 string khác khó hơn(ở đây dùng để mã háo mật khẩu))
const Account = require("../../models/account.model");

//[GET]  /admin/my-account
module.exports.index = async(req,res)=>{
    res.render("admin/pages/my-account/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Thông tin cá nhân"
    });
}

//[GET]  /admin/my-account/edit
module.exports.edit = async(req,res)=>{
    res.render("admin/pages/my-account/edit",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Chỉnh sửa thông tin cá nhân"
    });
}

//[PATCH]  /admin/my-account/edit
module.exports.editPatch = async(req,res)=>{
    const id = res.locals.user.id;//lúc này không còn lấy trong req.params.id(thông tin sửa nữa) mà lấy luôn ở biến toàn cục res.locals.id(biến lúc đăng nhập được lưu lại)
    
    const emailExist = await Account.findOne({ //kiểm tra xem khi sửa tài khoản có trùng email không
        _id: { $ne :id},//hàm này giúp tìm những bản ghi có id khác id bản ghi này(để tránh trường hợp khi sửa lại tài khoản không sửa email mà email này đã có trong database rồi nên bị lấy ra => ta dùng cách này)
        email: req.body.email, //req.body là những thông tin mà người tạo tài khoản gửi lên
        deleted: false
    });
    
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password); //nếu có cập nhật lại password thì ta dùng md5 mã hóa lại
        } else {
            delete req.body.password; //delete đi cái key object trong req.body(người dùng có thể không cập nhật lại mật khẩu,nếu cứ thể cập nhập cả req.body thì mật khẩu sẽ rỗng,vì vậy phải xóa key password trước khi nhập)
        }
        await Account.updateOne({_id: id}, req.body); //update lại theo req.body(đã chỉnh sửa)

        req.flash("success", "Cập nhật tài khoản thành công!");
    }

    res.redirect("back");
};