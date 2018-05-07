var number_of_item_in_stock;
var productCustomization = $('.detail-wrap');
var cart = $('#bag-shopping-cart');
var Arrays = new Array();
var cur_quantity;

$(function () {
    number_of_item_in_stock = $("#form-select-attributes #availability-number").text();
    var animating = false;
    $(".number-input .btn-touchspin-first").click(function () {
        cur_quantity = $("#pd_quantity").val();
        if (cur_quantity > 1)
            $("#pd_quantity").val(--cur_quantity);
    });

    $(".number-input .btn-touchspin-secondary").click(function () {
        cur_quantity = $("#pd_quantity").val();
        if (cur_quantity < 100)
            $("#pd_quantity").val(++cur_quantity);
    });

    initCustomization(productCustomization);

    function initCustomization(item) {
        //Xu ly sư kiện thêm sản phẩm vào giỏ hàng
        var addToCartBtn = item.find('#add-to-cart');
        addToCartBtn.on('click', function () {
            if (!animating) {
                //animate if not already animating
                animating = true;
                resetCustomization();

                // addToCartBtn.addClass('is-added').find('path').eq(0).animate({ 'stroke-dashoffset': 0 }, 300, function () {
                //     setTimeout(function () {
                //         updateCart();
                //         addToCartBtn.removeClass('is-added').find('span').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                //             //wait for the end of the transition to reset the check icon
                //             addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
                //             animating = false;
                //         });

                //         if ($('.no-csstransitions').length > 0) {
                //             // check if browser doesn't support css transitions
                //             addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
                //             animating = false;
                //         }
                //     }, 600);
                // });
            }

            
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({data:{"size": $("#i-select-size li.selected span").text(),"quantity":  $("#pd_quantity").val()}})
            }).done(function(result){

            }).fail(function(err){

            })

        });//  End addToCartBtn click
    }



    function resetCustomization() {
        // $("[data-type=select]").each(function () {
        //     $(this).children("li.selected").removeClass("selected");
        // });
    }


    //Xử lý sự kiện nhấn chọn size áo
    $("#i-select-size li").on('click', function () {
        //Xóa thẻ hiện đang được chọn
        $("#i-select-size li.selected").removeClass("selected");
        //Cập nhật lại thẻ mới
        $(this).addClass("selected");

        $("#add-to-cart.btn-noradius").prop('disabled', false);
    });

    function checkConditionToEnableAddToCartButton() {
        if ($("#i-select-size li").hasClass("selected")) {
            $("#add-to-cart.btn-noradius").prop('disabled', false);
        }
    }

    function updateCart() {
        var cartItems = cart.find('#cart-count'),
            text = parseInt(cartItems.text()) + 1;
        cartItems.text(text);
        cartItems.focus();
    }

    
});

$(".btn-item-delete").click(function(event){

    $.ajax({
        url: window.location.pathname + '/delete',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({data:{"id": $(this).data('pd-id')}})
    }).done(function(result){
        location.reload();
    }).fail(function(err){

    })
})

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}