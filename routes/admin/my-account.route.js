const express =require("express");
const multer = require("multer"); //nhúng file multer vào sẽ giúp tải ảnh lên được
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router =express.Router();

const upload = multer(); //nếu làm như 2 dòng bên trên thì khi upload thì sẽ upload vào file upload trong thư mục,còn ở đây là up load nên cloudy

const controller=require("../../controllers/admin/my-account.controller");

const uploadCloud= require("../../middlewares/admin/uploadCloud.middleware");

router.get("/",controller.index);

router.get("/edit",controller.edit);

router.patch(
    "/edit",
    upload.single("avatar"), //upload singe ở đây là upload 1 ảnh vào,và lưu ảnh ở trường thmbnail
    uploadCloud.upload,//hàm upload online
    controller.editPatch
);

module.exports = router;