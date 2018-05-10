var index_of_upload_image;

$(function () {
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
});



//thay đổi trạng thái khách hàng
$('[data-target="change-status"]').change(function(e){
    var active;
    var email = $(this).attr("data-id");
    console.log("STATUS");
    if($('[data-id="'+email+'"] input.inactive').is(":checked")){
        active = false;
    }else{
        active = true;
    }

    console.log(email, $('[data-email="'+email+'"] input').is(':checked'),active);

    $.ajax({
        url: '/admin/taikhoankhachhang/status',
        data: JSON.stringify({
            email: email,
            isAdmin: $('[data-email="'+email+'"] input').is(':checked'),
            active: active
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        success: function(respone){
            console.log(respone);
        }
    });
    e.preventDefault();
});

//thay đổi trạng thái khách hàng
$('[data-target="change-admin"]').change(function(e){
    console.log("ADMIN");
    var admin;
    var email = $(this).attr("data-email");


    if($('[data-email="'+email+'"] .check-admin').is(':checked'))
        admin = true;
    else
        admin = false;

    console.log(email, admin, $('[data-id="'+email+'"] input.active').is(':checked'));
    $.ajax({
        url: '/admin/taikhoankhachhang/status',
        data: JSON.stringify({
            email: email,
            isAdmin: admin,
            active: $('[data-id="'+email+'"] input.active').is(':checked')
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        success: function(respone){
            console.log(respone);
        }
    });
    e.preventDefault();
});

$("#set-category button").click(()=>{
    $("#set-category").submit();
})

$("#add-category-btn").click(()=>{
    $("#set-category").attr('action', '/admin/danhmucsanpham/themdanhmuc');
    $("#set-category").attr('method', 'POST');
})

//thêm danh mục
$("#set-category").submit(function (e) {
    var category = $('#inputCategory').val();
    var category_id = category.toLowerCase();
    category_id = change_alias(category_id);
    category_id = category_id.split(' ').join('-');

    var action = $('#set-category').attr('action');
    if (action != undefined && action!=null){
        $.ajax({
            url: action,
            type: $("#set-category").attr('method'),
            data: {
                category: category,
                old_id: $("#set-category").attr('product_id'),
                new_id: category_id
            },
            success: function (respone) {
                location.reload();
            }
        });
    }
    
    e.preventDefault();
    return false;
});

//Xử lý sự kiện button edit click
$('.edit').click(function() {
    var id = $(this).data('id');
    var category = $(this).data('value');
    
    $("#inputCategory").val($(this).data('value'));

    //Change all relative atrributes in form
    $("#set-category").attr('action', '/admin/danhmucsanpham/suadanhmuc');
    $("#set-category").attr('method', 'PUT');
    $("#set-category").attr('product_id', id);
});

//Xử lý sự kiện xóa tạm thời
$('.mark_delete').click(function() {
    var id = $(this).data('id');
    $.ajax({
        url : window.location.pathname + '/' + id,
        type : 'PUT'
    }).done(function(){
        alert("Đã đánh dấu xóa đơn hành trong CSDL");
        location.reload();
    }).fail(function(){
        alert("Đã xảy ra lỗi trong quá trình xóa đơn hàng. Vui lòng thử lại!");
    })
});

$('#myModal').on('hidden.bs.modal', function () {
    $("#inputCategory").val('');
})

//xem chi tiet don hang
$('[data-target="cartModal"]').click(function(e) {

    e.preventDefault();
    var id = $(this).data('cart-id');
    // console.log(id);
    $.get("/admin/donhang/chitietdonhang/" + id , function(data, status){
        console.log("return", data, status);
        var product_list = JSON.parse(data);
        var string_html;
        for (index in product_list){
            string_html +='<tr>'+
            '<td class="text-center"><img src="'+product_list[index].image+'" class="img-thumbnail"> </td>'+
            '<td class="text-left">'+product_list[index].productName+'</td>' +
            '<td class="text-left">'+product_list[index].size+'</td>' +
            '<td class="text-right">'+product_list[index].quantity+'</td>'+
            '<td class="text-right">'+product_list[index].price+'</td>'+
            '<td class="text-right">'+product_list[index].total+'</td>'+
            '</tr>';
        }
        $(".modal-body tbody").html(string_html);
        console.log(string_html);
        $('#myModal').modal('show');
        //$("body").append('<div class="modal-backdrop fade show"></div>');
        
    });
});



//Tao id cho danh mục
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