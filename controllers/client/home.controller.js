//[GET] /
module.exports.index = async(req,res)=>{
    res.render("client/pages/home/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Trang chủ",
    });
}