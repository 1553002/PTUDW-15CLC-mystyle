function dlgLogin() {
    var whitebg = document.getElementById("white-background");
    var dlg = document.getElementById("dlgbox");
    whitebg.style.display = "none";
    dlg.style.display = "none";
}

function showDialog() {
    var whitebg = document.getElementById("white-background");
    var dlg = document.getElementById("dlgbox");
    whitebg.style.display = "block";
    dlg.style.display = "block";

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    dlg.style.left = (winWidth / 2) - 480 / 2 + "px";
    dlg.style.top = "150px";
}

var index_of_upload_image;

$(function(){   
    var num_of_loops = 4;

    for (var i = 0; i < num_of_loops; i++){
        $("#i-product-images").append('<div class="col-md-3" id="product_image_'+(i+1)+'" data-tag="select-image"></div>');
        $("#i-product-images #product_image_"+(i+1)).html('<div class="image-view" id="imgTag_'+(i+1)+'"> <img  src="/image/405038_1_500x500.jpg" atl="Hình mẫu"></div>'+
        '<input type="text" name="product_image['+(i+1)+'][image]" value="/upload/405038_1_500x500.jpg" style="display:none;">'+
        '<button class="btn btn-primary" data-toggle="modal" data-target="#filemanager" data-whatever="@mdo">Chọn ảnh</button>'+
        '<button class="btn btn-warming" style="display: none;">Lưu ảnh</button>');
    }

    //Xu ly su kien nut "Chon anh" duoc click
    $("[data-tag=select-image] button.btn ").on('click', function(event){
        event.preventDefault();  
        index_of_upload_image = $(this).parent().children(0).children("img");
        //console.log(event);
    })

    $("#filemanager #button-upload").on('click',()=>{
        $("#myFile").click();
        //console.log(Math.random().toString(36).substring(7));
    });
    
    
    $(".modal").hasClass("show", function(){
        console.log(controller());
    })

    // $("[data-tag=select-image]").each(function(){
    //     console.log( $(this).children("button.btn:first"));
    //     $(this).children("button.btn:first").on('click', function(){
    //         alert();
    //     })
    //     // $(this).children("label.btn").children(1).on('change', function(){
    //     //     var selectedImage = event.target.files[0];
    //     //     selectedImageArray.push(selectedImage);

    //     // var classTmp = $(this).parent().siblings(0);
       
    //     // var reader = new FileReader();
    //     //     reader.onload = function(e){
    //     //         $(classTmp.children('img')).attr('src', e.target.result);
    //     //     }
    //     //     reader.readAsDataURL(selectedImage);
    //     // });
    // });
});

$('.delete').on('click', function (event) {
    event.preventDefault();
    var id = $(this).data('id');
    $.ajax({
        url: '/admin/' + id,
        type: 'DELETE',
        success: function () {
            location.reload();
        }
    })
})

$('#myFile').on('change', function (evt) {
    //evt.preventDefault();
    //console.log('myFile change');
    var formData = new FormData();

    var file = evt.target.files[0];
    var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log(id);
    var filename = "mystyle-model-"+id+".png";
    formData.append('nameFile', filename);
    formData.append('myFile', file);


    var xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = function (e) {
        console.log("onprogress");
        $('#button-upload i').replaceWith('<i class="fas fa-spinner"></i>');
        $('#button-upload').prop('disabled', true);
    };

    xhr.onerror = function (e) {
        //showInfo('An error occurred while submitting the form. Maybe your file is too big');

        console.log("error");
    };
    xhr.onload = function () {
        console.log("onload");
        $('#button-upload i').replaceWith('<i class="fa fa-upload"></i>');
        $('#button-upload').prop('disabled', false);
        $("#imagePreview").append('<div class="col-md-3">'+
        '<img src="/upload/'+filename +'" style="width: 100%;" data-value="'+filename +'">'+
        '</div>');
    };
    xhr.open('POST', '/admin/', true);
    xhr.send(formData);
});

// $(document).on('click', '#imagePreview img', function(){
//     alert();
//     var chosenFilename = $(this).attr("data-value");
    
//     //Close modal
//     $("[data-dismiss='modal']").click();
//     $(index_of_upload_image).attr('src', '/upload/'+ chosenFilename);
//     console.log(index_of_upload_image.parent().parent().children('input'));

//     $(index_of_upload_image.parent().parent().children('input')).val('/upload/'+chosenFilename);
// });

$('#input-product-price').on('input', function(e){
    $(this).val(formatCurrency(this.value.replace(/[,VNĐ]/g,'')));
}).on('keypress',function(e){
    if(!$.isNumeric(String.fromCharCode(e.which))) e.preventDefault();
}).on('paste', function(e){    
    var cb = e.originalEvent.clipboardData || window.clipboardData;      
    if(!$.isNumeric(cb.getData('text'))) e.preventDefault();
});

function formatCurrency(number){
    var n = number.split('').reverse().join("");
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
    return  n2.split('').reverse().join('');
}
