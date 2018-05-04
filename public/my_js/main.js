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