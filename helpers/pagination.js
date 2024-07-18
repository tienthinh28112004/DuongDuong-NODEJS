module.exports=(objectPagination,query,countProducts)=>{
    if(query.page){// lấy giá trị sau dấu ? trên url(sau đó sửa sang gì thì ở phái dưới)
        objectPagination.currentPage=parseInt(query.page); //do req.query.page là dạng string nên phải dùng parseInt để chuyển sang number(mục tiêu phân trang)
        //nếu không phải là số nguyên mà là chữ thì không chạy được mặc định là trạng 1,do object khai báo mặc định là 1
    }
    objectPagination.skip=(objectPagination.currentPage-1)*objectPagination.limitItem;//vị trí bắt đầu lấy sản phẩm 

    
    const totalPage=Math.ceil(countProducts/objectPagination.limitItem);//math ceil là làm tròn các số lên,còn totalpage là số lượng trang
    objectPagination.totalPage=totalPage;

    return objectPagination;
}