var number_of_item_in_stock;
var productCustomization = $('.detail-wrap');
var cart = $('#bag-shopping-cart');

$(function(){
    number_of_item_in_stock = $("#form-select-attributes #availability-number").text();
    var animating = false;
    $(".number-input .btn-touchspin-first").click(function(){
        var cur_quantity = $("#quantity").val();
        //alert(cur_quantity);
        if (cur_quantity > 1)
            $("#quantity").val(--cur_quantity);
    });

    $(".number-input .btn-touchspin-secondary").click(function(){
        var cur_quantity = $("#quantity").val();
        if (cur_quantity < 100)
            $("#quantity").val(++cur_quantity);
    });

    initCustomization(productCustomization);

    function initCustomization(item){
        var addToCartBtn = item.find('#add-to-cart');

        addToCartBtn.on('click', function(){
            if (!animating){
                //animate if not already animating
                        animating =  true;
                        resetCustomization();
    
                        addToCartBtn.addClass('is-added').find('path').eq(0).animate({'stroke-dashoffset':0}, 300, function(){
                            setTimeout(function(){
                                updateCart();
                                addToCartBtn.removeClass('is-added').find('span').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                                    //wait for the end of the transition to reset the check icon
                                    addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
                                    animating =  false;
                                });
    
                                if( $('.no-csstransitions').length > 0 ) {
                                    // check if browser doesn't support css transitions
                                    addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
                                    animating =  false;
                                }
                            }, 600);
                        });
            }
        });
    }

    function resetCustomization() {
		$("[data-type=select]").each(function(){
            $(this).children("li.selected").removeClass("selected");
        });
	}


    //Xử lý sự kiện nhấn chọn size áo
    $(".i-select-size li").on('click', function(){
        //Xóa thẻ hiện đang được chọn
        $(".i-select-size li.selected").removeClass("selected");
        //Cập nhật lại thẻ mới
        $(this).addClass("selected");

        checkConditionToEnableAddToCartButton();
    });

    //Xử lý sự kiện nhấn chọn màu áo
    $(".i-select-color li").on('click', function(){
        //Xóa thẻ hiện đang được chọn
        $(".i-select-color li.selected").removeClass("selected");
        //Cập nhật lại thẻ mới
        $(this).addClass("selected");

        checkConditionToEnableAddToCartButton();
    });

    function checkConditionToEnableAddToCartButton(){
        if ($(".i-select-size li").hasClass("selected") && $(".i-select-color li").hasClass("selected")){
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

