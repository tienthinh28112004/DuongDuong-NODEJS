//hàm lấy ra các danh mục con(giúp khi tìm thời trang có thể ra luôn cả các dản phẩm trong danh mục con thời trang nam)
const productCategory = require("../models/product-category.model")

// module.exports.getSubCategory = async(parentId) => {
//     const subs = await ProductCategory.find({
//         parent_id: parentId,
//         status: "active",
//         deleted: false
//     });

//     let allSub = [...subs];//tạo ra 1 mảng để lưu hết các phần tử

//     for(const sub of subs){
//         const childs = await getSubCategory(sub.id);//tiếp tục từ id con đệ quy tiếp
//         allSub = allSub.concat(childs);//lấy các phần tửu của childs sang allSub
//     }

//     return allSub;
// }=>không viết như vầy vì để module không đệ quy được(đáp án đúng ở dưới)

module.exports.getSubCategory = async (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await productCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        });

        let allSub = [...subs]; //tạo ra 1 mảng để lưu hết các phần tử

        for (const sub of subs) {
            const childs = await getCategory(sub.id); //tiếp tục từ id con đệ quy tiếp
            allSub = allSub.concat(childs); //lấy các phần tửu của childs sang allSub
        }

        return allSub;
    }

    const result = await getCategory(parentId);
    return result;
}