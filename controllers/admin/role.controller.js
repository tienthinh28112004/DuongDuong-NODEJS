const Role=require("../../models/role.model")

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

//[GET]  /admin/roles(đây là trang nhóm quyền)
module.exports.index= async (req,res)=>{
    let find ={
        deleted:false
    };

    const records=await Role.find(find);

    res.render("admin/pages/roles/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"nhóm quyền",
        records:records
    });
}

//[GET]  /admin/roles/create(link sang trang create)
module.exports.create= async (req,res)=>{
    res.render("admin/pages/roles/create",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Tạo nhóm quyền"
    });
}

//[POST]  /admin/roles/create (lưu thông tin trang create nhận được vào database)
module.exports.createPost= async (req,res)=>{
    //lưa thông tin tạo được vào database
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

//[GET]  /admin/roles/edit/:id
module.exports.edit= async (req,res)=>{
    try {
        const id=req.params.id;

        let find={
            _id : id,
            deleted:false
        }

        const data=await Role.findOne(find);

        res.render("admin/pages/roles/edit",{
            //khi dùng render thì nó tự động vào views
            pageTitle:"Sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
   
};

//[PATCH]  /admin/roles/edit/:id
module.exports.editPatch= async (req,res)=>{
    try {
        const id=req.params.id;

        await Role.updateOne({_id: id},req.body);

        req.flash("success","Cập nhật nhóm quyền thành công!");
   
    } catch (error) {
        req.flash("error","Cập nhật nhóm quyền thất bại!");
    }
     res.redirect("back");
};

//[GET]  /admin/roles/permissions
module.exports.permissions= async (req,res)=>{
   let find={
    deleted: false
   };

   const records = await Role.find(find);
   res.render("admin/pages/roles/permissions",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Phân quyền",
        records: records
    });
};


//[PATCH]  /admin/roles/permissions
module.exports.permissionsPatch= async (req,res)=>{
    //gửi bất cứ cái gì qua form thì đều lấy được qua req.body
    const permissions = JSON.parse(req.body.permissions);//lưu cặp name="permissions" nên phải req.body.permissions để đi được vào thẻ input cần chuyển từ chuỗi json về mảng dùng json.parse(có nhiều input nên phải chấm vào  value permission để lấy )
    for(const item of permissions){
        await Role.updateOne({_id: item.id}, {permissions: item.permissions});
       
    }
    req.flash("success","Cập nhật trạng thái thành công");

    res.redirect("back");
};