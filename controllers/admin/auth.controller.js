const md5 = require("md5"); //nhứng thư viện md5 vào đây(thư viện này có atsc dụng mã hóa 1 string sang thành 1 string khác khó hơn(ở đây dùng để mã háo mật khẩu))
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

//[GET]  /admin/auth/login
module.exports.login=(req,res)=>{
    if(req.cookies.token){//nếu mà đã có token(đã đăng nhập rồi) thì nó sẽ chạy đến trang danh sách sản phẩm luôn
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }else{//còn nếu chưa có token thì chyaj vào trang đăng nhập
        res.render("admin/pages/auth/login",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Trang đăng nhập"
    });
    }
   
}

//[POST]  /admin/auth/login
module.exports.loginPost = async (req,res) => {
    const email = req.body.email;//ngoài cách thủ công này ra có thể dùng destructering(phá vỡ cấu trúc)
    const password = req.body.password;//{email,password}=req.body

    const user=await Account.findOne({
        email: email,
        deleted: false
    });
    if(!user){//check xem đã có tài khoản dùng email này chưa
        req.flash("error","Email không tồn tại!");
        res.redirect("back");
        return ;
    }
    //do ở trên đã lấy được user(1 object bản ghi) nên ta có thể check password bằng user.password với md5(password)(mã hóa password)
    if(md5(password) != user.password) {
        req.flash("error","Mật khẩu bạn nhập sai!");
        res.redirect("back");
        return ;
    }
    if(user.status == "inactive"){//chekc thêm trường hợp tài khoảng không hoạt động(inactive),nếu nó không hoạt động hiện thông báo và return
        req.flash("error","Tài khoản đã bị khóa!");
        res.redirect("back");
        return ;
    }

    res.cookie("token",user.token);//gán 1 key token cookie rồi gán value cho nó bằng (token trong database đưa lên) user.token
    //nếu đăng nhập thành công(thỏa mãn các điều kiên bên trên)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

//[GET]  /admin/auth/logout
module.exports.logout = (req,res)=>{
   //khi đăng nhập vào thì sẽ có 1 cái token lưu vào trong cookie nhờ cái token ấy mà đi đến được các trang
   //=>vì vậy muốn đăng xuất thì chỉ cần xóa token trong cookie
   res.clearCookie("token");//hàm xóa token trong cookie
   res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
