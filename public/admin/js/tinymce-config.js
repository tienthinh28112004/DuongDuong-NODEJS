tinymce.init({//hàm giúp định dạng các kiểu chữ(chữ nghiêng chữ thẳng)
  selector: 'textarea.textarea-mce',//(chọn những thẻ textarea có class là textarea-mce)tìm đến các thẻ textarea có class là textarea-mce
  plugins: "image", //dùng plugin để upload ảnh
  file_picker_callback: function (cb,value,meta){// hàm có sẵn để có thể đưa ảnh nên trong tinymce
    var input = document.createElement('input');
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*');

    input.onchange = function (){
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function (){
        var id = 'blobid' + (new Date()).getTime();
        var blodCache = tinymce.activeEditor.activeUpload.blodCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id,file,base64);
        blodCache.add(blobInfo);

        cb(blobInfo.blobUri(),{title: file.name});
      };
      reader.readAsDataURL(file)
    };
  }
});