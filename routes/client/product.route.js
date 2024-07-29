const express =require("express");
const router =express.Router();

const controller=require("../../controllers/client/product.controller");

router.get("/",controller.index);

router.get("/:slugCategory",controller.category);//truyền động slug

router.get("/detail/:slugProduct",controller.detail);//truyền động slug

module.exports=router;