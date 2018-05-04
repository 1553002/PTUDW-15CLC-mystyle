var index_of_upload_image;

$(function () {
    // var num_of_loops = 4;

    // for (var i = 0; i < num_of_loops; i++){
    //     $("#i-product-images").append('<div class="col-md-3" id="product_image_'+(i+1)+'" data-tag="select-image"></div>');
    //     $("#i-product-images #product_image_"+(i+1)).html('<div class="image-view" id="imgTag_'+(i+1)+'"> <img  src="/image/405038_1_500x500.jpg" atl="Hình mẫu"></div>'+
    //     '<input type="text" name="product_image['+(i+1)+'][image]" value="/upload/405038_1_500x500.jpg" style="display:none;">'+
    //     '<button class="btn btn-primary" data-toggle="modal" data-target="#filemanager" data-whatever="@mdo">Chọn ảnh</button>'+
    //     '<button class="btn btn-warming" style="display: none;">Lưu ảnh</button>');
    // }

    //Xu ly su kien nut "Chon anh" duoc click
    $("[data-tag=select-image] button.btn ").on('click', function (event) {
        event.preventDefault();
        index_of_upload_image = $(this).parent().children(0).children("img");
        //console.log(event);
    })

    $("#filemanager #button-upload").on('click', () => {
        $("#myFile").click();
        //console.log(Math.random().toString(36).substring(7));
    });


    $(".modal").hasClass("show", function () {
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


$("#ThemDanhMuc").submit(function (e) {
    var category = $('#inputCategory').val();
    var category_id = category.toLowerCase();
    category_id = change_alias(category_id);
    category_id = category_id.split(' ').join('-');;
    console.log(category_id);


    $.ajax({
        url: '/admin/themdanhmuc',
        type: 'POST',
        data: {
            category: category,
            CategoryId: category_id
        },
        success: function (respone) {
            location.reload();
        }
    });
    return false;

});


function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}


$('#myFile').on('change', function (evt) {
    //evt.preventDefault();
    //console.log('myFile change');
    var formData = new FormData();

    var file = evt.target.files[0];
    var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log(id);
    var filename = "mystyle-model-" + id + ".png";
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
        $('#button-upload i').replaceWith('<i class="fa fa-upload"></i>');
        $('#button-upload').prop('disabled', false);
        $("#imagePreview").append('<div class="col-md-3">' +
            '<img src="/upload/' + filename + '" style="width: 100%;" data-value="' + filename + '">' +
            '</div>');
    };
    xhr.open('POST', '/admin/', true);
    xhr.send(formData);
});

$(document).on('click', '#imagePreview img', function () {
    var chosenFilename = $(this).attr("data-value");

    //Close modal
    $("[data-dismiss='modal']").click();
    $(index_of_upload_image).attr('src', '/upload/' + chosenFilename);
    console.log(index_of_upload_image.parent().parent().children('input'));

    $(index_of_upload_image.parent().parent().children('input')).val('/upload/' + chosenFilename);
});

$('#input-product-price').on('input', function (e) {
    $(this).val(formatCurrency(this.value.replace(/[,VNĐ]/g, '')));
}).on('keypress', function (e) {
    if (!$.isNumeric(String.fromCharCode(e.which))) e.preventDefault();
}).on('paste', function (e) {
    var cb = e.originalEvent.clipboardData || window.clipboardData;
    if (!$.isNumeric(cb.getData('text'))) e.preventDefault();
});

function formatCurrency(number) {
    var n = number.split('').reverse().join("");
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
    return n2.split('').reverse().join('');
}

//Xử lý data table
$(document).ready(function () { $("#dataTable").DataTable() });