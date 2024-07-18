//[GET]  /admin/dashboard

module.exports.dashboard=(req,res)=>{
    res.render("admin/pages/dashboard/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Trang tong quan"
    });
}