function hvr(dom, action) {
    if (action == 'in') {
        $(dom).find("[col=g]").css("display", "none");
        $(dom).find("[col=b]").css("display", "block");
    }

    else {
        $(dom).find("[col=b]").css("display", "none");
        $(dom).find("[col=g]").css("display", "block");
    }
}

var autoSwitchSpeed = 4000;
var autoSwitch = true;

$('.slide').first().addClass('active');
$('.slide').hide();
$('.active').show();

if (autoSwitch == true) {
    setInterval(function () {
        $('.active').removeClass('active').addClass('oldActive');

        if ($('.oldActive').is(':last-child')) {
            $('.slide').first().addClass('active');
        } else {
            $('.oldActive').next().addClass('active');
        }

        $('.oldActive').removeClass('oldActive');
        jQuery('.slide').fadeOut(500);
        jQuery('.active').fadeIn(800);
    }, autoSwitchSpeed);

}