//[GET] /

module.exports.index=(req,res)=>{
    res.render("client/pages/home/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Trang chu"
    });
}