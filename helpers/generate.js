//hàm này có thể tạo ra 1 string ramdom dành cho token
module.exports.generateRamdomString = (length)=>{//length là số kí tự mà chúng ta muốn ramdom
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";

    let result = "";

    for(let i=0;i < length; i++){
        result +=characters.charAt(Math.floor(Math.ramdom() * characters.length));
    }

    return result;
};