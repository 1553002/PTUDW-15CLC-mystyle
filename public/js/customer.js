var year_upper_bound = (new Date()).getFullYear();
var year_lower_bound = 1946;
var number_of_month = 12;
var day_of_month_upper_bound = 31;
var gender = document.getElementById("gender").value;

function isLeapYear(year) {
    return new Date(year, 2, 0).getDate() > 28;
}

function getDaysOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/*
    Kiem tra upper-bound cua thang
    1.1. Neu upper-bound > so ngay hien co cua thang --> append
    1.2. Neu upper-bound < so ngay hien co cua thang --> remove
*/
function CheckValidChosenDay(year, month, day) {
    var day_of_month = getDaysOfMonth(year, month);
    var tmp = $('#day option:last-child').val();
    
    while (tmp > day_of_month) {
        $("#day option[value= '" + tmp + "']").remove();
        tmp = $('#day option:last-child').val();
    }

    while (tmp < day_of_month) {
        tmp++;
        $("#day").append("<option value='" + ('0' + tmp).slice(-2) + "'>" + ('0' + tmp).slice(-2) + "</option>");
        tmp = $('#day option:last-child').val();
    }
}

function phatSinhNgay(month, year) {
    var number_of_day = getDaysOfMonth(year, month);

    $("#day").append("<option value= 0>Ngày</option>");
    for (var z = 1; z <= number_of_day; z++) {
        $("#day").append("<option value='" + ('0' + z).slice(-2) + "'>" + ('0' + z).slice(-2) + "</option>");
    }
}

$(function () {
    var monthChosen, dayChosen, yearChosen;
    monthChosen = number_of_month;
    yearChosen = year_lower_bound;

    //Phat sinh nam
    $("#year").append("<option value= 0>Năm</option>");
    for (var i = year_upper_bound; i > year_lower_bound; i--) {
        $("#year").append("<option>" + i + "</option>");
    }

    //Phat sinh thang
    $("#month").append("<option value= 0>Tháng</option>");
    for (var j = 1; j <= number_of_month; j++) {
        $("#month").append("<option value='" + ('0' + j).slice(-2) + "'>" + ('0' + j).slice(-2) + "</option>");
    }

    phatSinhNgay(monthChosen, yearChosen);

    $("#month").change(function () {
        monthChosen = $("#month option:selected").val();
        CheckValidChosenDay(yearChosen, monthChosen, dayChosen);
    });

    $('#year').change(function(){
        yearChosen =  $('#year option:selected').val();
        CheckValidChosenDay(yearChosen, monthChosen, dayChosen);
    });

    var hash = document.location.hash;
    var prefix = "tab_";
    if (hash) {
        $('.nav-tabs a[href="'+hash.replace(prefix,"")+'"]').tab('show');
    }
});

$('#dwfrm_profile_customer_isemailsubscribed').on('click', function () {
    if ($(this).is(":checked")) {
        $(this).parent().removeClass('checkbox-is-checked');
    } else {
        $(this).parent().addClass('checkbox-is-checked');
    }
});

if(gender.indexOf("true")>=0)
{
    document.getElementById("male").checked =true;
}
else
{
    document.getElementById("female").checked =true;
}


$('#edit-account').on('submit', function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var name = document.getElementById("full_name").value;
    var old_pass =document.getElementById("old_password").value;
    var new_pass =document.getElementById("new_password").value;
    var re_new_pass =document.getElementById("re_new_password").value;
    
    if(old_pass && new_pass && re_new_pass )
    {
       if(new_pass.localeCompare(re_new_pass)!=0)
       {
           alert("Vui lòng nhập lại mật khẩu kiểm tra.")
           return;
       }
    }
    else
    {
        if(!old_pass && !new_pass && !re_new_pass)
        {
            old_pass="";
            new_pass="";
            re_new_pass="";
        }
        else
        {
            alert("Vui lòng nhập đầy đủ mật khẩu.")
            return;
        }
    }


    var gender=false;
    if(document.getElementById("male").checked==true)
    {
        gender=true;
    }
  
    
    var userContent = {};
    userContent.email = email;
    userContent.fullname = name;
   // userContent.gender = gender;


    $.ajax
    ({
        url: '/customer/account/edit',
        data: JSON.stringify({
            email: email,
            fullname: name,
            gender:gender,
            old_pass: old_pass,
            new_pass: new_pass,
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        success: function () 
        {
            location.reload();
            
        }
    });

    
});


// Javascript to enable link to tab

