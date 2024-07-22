const express = require("express");
const multer = require("multer"); //nhúng file multer vào sẽ giúp tải ảnh lên được
const router = express.Router();

const upload = multer(); //đây là up load nên cloudy

const controller = require("../../controllers/admin/product-category.controller");

const validate = require("../../validates/admin/product-category.validate"); //nhúng validate vào

const uploadCloud= require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create",controller.create);

router.post(
    "/create",
    upload.single("thumbnail"), //upload singe ở đây là upload 1 ảnh vào,và lưu ảnh ở trường thmbnail
    uploadCloud.upload,//hàm upload online
    validate.createPost, //đây gọi là midlewhere hàm trung gian nó sẽ check hàm trên đúng chưa nếu đúng rồi nó sẽ trả về next() để xuống dòng phía dưới,còn nếu không thì code ngừng luôn
    controller.createPost // cũng đi vào route /create nhưng phương thức khác khi vào trang create bằng phương thức get rồi thì khi tạo mới sẽ dùng đến phương thức post,
);

router.get("/edit/:id",controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

module.exports=router;

