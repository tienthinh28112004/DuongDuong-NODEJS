let count=0;
const createTree = (arr,parentId = "") =>{//hàm này sử dụng đệ quy
    const tree=[];
    arr.forEach((item) => {
        if(item.parent_id === parentId){//kiểm tra xem parentId có bằng item.parentId hay không
            count++;//cái anyf dùng để đếm số thứ tự(dùng 1 biến tổng quái bên hàm createtree rồi truyền sang file chính)
            const newItem = item;
            const children =createTree(arr,item.id);//sử dụng đệ quy để gán biến có children
            if(children.length > 0){//nếu có con thì chạy vào đây và gán biến
                newItem.children=children;//tạo thêm 1 key children cho newItem rồi gán biến children bên trên cho nó
            }
            newItem.index = count;//gán thêm 1 key cho value để đánh dấu index(stt)
            tree.push(newItem);//hết đệ quy thì push newItem ấy vào tree
        }
    });
    return tree;//chú ý là phải mở nodejs trên dev tool ra mới thấy được
};

module.exports.tree = (arr,parentId = "") =>{
    count = 0;//reset lại biến count(stt) về 0
    const tree=createTree(arr,parentId = "");//lấy dữ liệu ở ngay dòng trên gán xuống
    return tree;//chú ý là phải mở nodejs trên dev tool ra mới thấy được
}