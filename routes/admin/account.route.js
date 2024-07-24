const express =require("express");
const multer = require("multer"); //nhúng file multer vào sẽ giúp tải ảnh lên được
const router =express.Router();

const upload = multer(); //nếu làm như 2 dòng bên trên thì khi upload thì sẽ upload vào file upload trong thư mục,còn ở đây là up load nên cloudy

const controller=require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate"); //nhúng validate vào
const uploadCloud= require("../../middlewares/admin/uploadCloud.middleware");

router.get("/",controller.index);

router.get("/create",controller.create);

router.post(
    "/create",
    upload.single("avatar"), //upload singe ở đây là upload 1 ảnh vào,và lưu ảnh ở trường thmbnail
    uploadCloud.upload,//hàm upload online
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id",controller.edit);

router.patch(
    "/edit/:id",
    upload.single("avatar"), //upload singe ở đây là upload 1 ảnh vào,và lưu ảnh ở trường thmbnail
    uploadCloud.upload,//hàm upload online
    validate.editPatch,
    controller.editPatch
);

module.exports=router;