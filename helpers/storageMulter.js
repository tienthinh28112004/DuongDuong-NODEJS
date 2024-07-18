//hàm giúp upload ảnh có thể nhìn được trong tab khác
const multer=require("multer");
//multer lưu ngầm rồi nên không cần đưa thêm file vào trong hàm moudle.express phía dưới
module.exports=()=>{
    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,"./public/uploads");// thắc mắc thì nên gõ storage đọc dox
        },
        filename: function(req,file,cb){
            const uniqueSuffix=Date.now();
            cb(null,`${uniqueSuffix}-${file.originalname}`);
        },
    });

    return storage;
};