const mongoose =require("mongoose");// nhúng mongose vào(mongose là database)

module.exports.connect= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);//kết nối với database,link database mã hóa bảo mật trong env
        console.log("Connect Success!");
    } catch(error){
        console.log("Connect Error!");
    }
}
