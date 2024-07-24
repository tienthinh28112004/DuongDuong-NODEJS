const md5 = require("md5"); //nhứng thư viện md5 vào đây(thư viện này có atsc dụng mã hóa 1 string sang thành 1 string khác khó hơn(ở đây dùng để mã háo mật khẩu))
const Account = require("../../models/account.model");
const Role = require("../../models/role.model"); //nhúng model role vào

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

//[GET]  /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token"); //sử dụng select để chỉ lấy ra tất cả dữ liệu trừ password token ra(thông tin quan trọng),hoặc có thể dùng select("fullName email") để lấy ra password và email cũng được

    for (const record of records) {
        const role = await Role.findOne({ //role ở đây là 1 object đại diện cho quyền của nó
            _id: record.role_id, //so sánh id trong role(nhóm quyền) với role_id để  lấy ra nhóm quyền
            deleted: false
        });
        record.role = role; //add thêm 1 nhóm quyền role bằng 1 object role cho record
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
        email: req.body.email, //req.body là những thông tin mà người tạo tài khoản gửi lên
        deleted: false
    });

    if (emailExist) { //nếu đã tồn tại acc dùng email này rồi thfi không cho tạo
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    } else { //email này chưa được dùng để nhập thì cho tạo
        req.body.password = md5(req.body.password); //mã hóa mật khẩu thành 1 chuỗi khác thì dùng thư viện md5

        const record = new Account(req.body); //Lưu các thông tin nhập vào vào 1 bản record
        await record.save(); //lưu vào database

        res.redirect(`${systemConfig.prefixAdmin}/accounts`); //trở lại trang admin/accounts
    }
};

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    try {
        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false,
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    //req.params là cái mà mình gửi lên url còn req.body là những cái mình điền trong biểu mẫu để cập nhật
    const emailExist = await Account.findOne({ //kiểm tra xem khi sửa tài khoản có trùng email không
        _id: { $ne :id},//hàm này giúp tìm những bản ghi có id không giống id bản ghi này(để tránh trường hợp khi sửa lại tài khoản không sửa email mà email này đã có trong database rồi nên bị lấy ra ta dùng cách này)
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