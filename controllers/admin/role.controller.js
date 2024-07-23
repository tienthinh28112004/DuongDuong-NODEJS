const Role=require("../../models/role.model")

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
    res.send("ok");
}