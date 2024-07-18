module.exports=(query)=>{
    let objectSearch={
        keyword: "",
    }

    if(query.keyword){
        objectSearch.keyword=query.keyword;//keyword ở đây là string,lấy trong url ,tác dụng ở bên dưới

        const regex= new RegExp(objectSearch.keyword,"i");// regex ở đây giúp khi nhập tìm kiếm iphone thì có thể trả về các loại iphone khác,ở trong ngoặc phải là string,i ở đây có tác dụng không phân biệt hoa thường
        objectSearch.regex=regex;
    }
    
    return objectSearch;
}