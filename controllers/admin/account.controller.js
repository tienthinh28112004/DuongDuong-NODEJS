const md5 = require("md5"); //nhứng thư viện md5 vào đây(thư viện này có atsc dụng mã hóa 1 string sang thành 1 string khác khó hơn(ở đây dùng để mã háo mật khẩu))
const Account = require("../../models/account.model");
const Role = require("../../models/role.model"); //nhúng model role vào

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

//[GET]  /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token");//sử dụng select để chỉ lấy ra tất cả dữ liệu trừ password token ra(thông tin quan trọng),hoặc có thể dùng select("fullName email") để lấy ra password và email cũng được

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
           deleted: false 
        });
        record.role = role;//add thêm 1 key role trong object từ đấy chấm vào title sẽ ra thê quyền
    }
    res.render("admin/pages/accounts/index", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Danh sách tài khoản",
        records: records
    });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ //sử dùng Role để tìm các quyền
        deleted: false
    });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        Roles: roles // trả roles ra ngoài giao diện để có thể hiện lên được các quyền
    });
};

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({ //kiểm tra xem khi tạo tài khoản có trùng email không
        email: req.body.email,//req.body là những thông tin mà người tạo tài khoản gửi lên
        deleted: false
    });

    if (emailExist) { //nếu đã tồn tại acc dùng email này rồi thfi không cho tạo
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    } else { //email này chưa được dùng để nhập thì cho tạo
        req.body.password = md5(req.body.password); //mã hóa mật khẩu thành 1 chuỗi khác thì dùng thư viện md5

        const record = new Account(req.body); //Lưu các thông tin nhập vào vào 1 bản record
        await record.save(); //lưu vào database

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);//trở lại trang admin/accounts
    }

};