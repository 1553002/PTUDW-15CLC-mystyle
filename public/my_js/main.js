function openNav() {
    document.getElementById("sidebar").style.left = "0";
}

function closeNav() {
    document.getElementById("sidebar").style.left = "-100%";
}

var sourceSwap = function () {
    var $this = $(this);
    var newSource = $this.data('alt-src');
    $this.data('alt-src', $this.attr('src'));
    $this.attr('src', newSource);
}

function formatPrice(nStr, decSeperate, groupSeperate) {
    nStr += '';
    x = nStr.split(decSeperate);
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }

    return x1 + x2;
}

$(function () {
    $('img.bell').hover(sourceSwap, sourceSwap);
});


$(document).ready(function () {
    $('.thumbnail-item img').hover(function () {
        var src = $(this).attr('src');
        $('.preview-main img').attr('src', src);
    });
});

/*Tạo dialog giỏ hàng*/
function dlgLogin(){
    var whitebg = document.getElementById("white-background");
    var dlg = document.getElementById("dlgbox");
    whitebg.style.display = "none";
    dlg.style.display = "none";
}

function showDialog(){
    var whitebg = document.getElementById("white-background");
    var dlg = document.getElementById("dlgbox");
    whitebg.style.display = "block";
    dlg.style.display = "block";
    
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    
    dlg.style.left = (winWidth/2) - 480/2 + "px";
    dlg.style.top = "150px";
}