<reference path="../../typings/globals/jquery/index.d.ts" />
$(document).ready(function(){
    var speed = 4000;
    var autoSwitch = true;
    
    $('.slide').first().addClass('active');
    $('.slide').hide();
    $('.active').show();
});