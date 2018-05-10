

var index=1;
var area =document.getElementById("design-area");
var shirt=document.getElementById("design-shirt");
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var fonts = ["Montez","Lobster","Josefin Sans","Shadows Into Light","Pacifico","Amatic SC", "Orbitron", 
"Rokkitt","Righteous","Dancing Script","Bangers","Chewy","Sigmar One","Architects Daughter","Abril Fatface",
"Covered By Your Grace","Kaushan Script","Gloria Hallelujah","Satisfy","Lobster Two","Comfortaa","Cinzel","Courgette"];
var mycanvas, mycanvas_back , isFront=true;
var img_modal;
var shirt_list;
var str_canvas;
var shirt_front =document.getElementById("shirt-area");
var shirt_back =document.getElementById("shirt-back-area");
var curID=0;




var number_of_item_in_stock;
var productCustomization = $('.detail-wrap');
var cart = $('#bag-shopping-cart');
var Arrays = new Array();
var cur_quantity, order_quantity = 0;




function convertImgToBase64(url, myimage, outputFormat){
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this,0,0);
      var dataURL = canvas.toDataURL('image/png');
      myimage.src=dataURL;
    
      canvas = null; 
  };
  img.src = url;
  
}

function Choose_Img(src) {
    var id="image"+index;
    index=index+1;
    
    var x =createParent(id); // tao the cha de chua the hinh anh

    y=document.createElement("img");
    y.setAttribute("src",src);
    y.setAttribute("id",id);
    y.setAttribute("width","100%");
    y.setAttribute("height","100%");
    y.setAttribute("class","img_content"); // the con class img_content

    convertImgToBase64(src,y);
    x.appendChild(y);
   

    
}


var getDataUrl = function (img) 
{
     var canvas = document.createElement('canvas');
     
         canvas.width = img.width;
         canvas.height = img.height;
       
     var ctx = canvas.getContext('2d');
         ctx.drawImage( img, 0, 0 ); 
         return canvas.toDataURL( );
};

function split_shirt(alt)
{
  shirt_list=alt.split(" ");

}
function Choose_shirt(src,alt)
{
  var shirt= document.getElementById("design-shirt");   
  var shirt_back =  document.getElementById("design-back-shirt");   



  convertImgToBase64(src,shirt);
  convertImgToBase64(alt,shirt_back);

  
}
function Choose_shirt_from_modal(src,alt)
{
  var shirt= document.getElementById("design-shirt");   
  var shirt_back =  document.getElementById("design-back-shirt");   

  shirt.src=src;
  shirt_back.src=alt;
}
function Choose_shirt_color(color)
{
  var shirt= document.getElementById("design-shirt");   
  var shirt_back =  document.getElementById("design-back-shirt");   

 
  var src_front="";
  var src_back="";

    src_front=shirt_list[1];
    src_back=shirt_list[0];
  
    alert(src_back);
  convertImgToBase64(src_front,shirt);
  convertImgToBase64(src_back,shirt_back);
}
// Tao anh co the di chuyen dc 
  window.onload = function()
  {
      var _startX = 0;			// mouse starting positions
      var _startY = 0;
      var _offsetX = 0;			// current element offset
      var _offsetY = 0;
      var _temp;			// will use as tempurarily variable OnMouseDown to OnMouseMove
      this.onmousedown = MouseDown;
      this.onmouseup = MouseUp;
    }




  function MouseDown(e) {

    // All browser takes target except IE


    var target = e.target != null ? e.target : e.srcElement;
    
    
    if (target.className == 'nhan_image' || target.className=='img_content'||target.className=='text_content' ) 
    {

      $('.anchor').remove();
      $('.anchor_delete').remove();
      //$('.anchor_rotate').remove();
      $('.nhan_image').css({"border-style":"none"});

      var imgId=target.id.split(" ");

      // store the mouse position
      _startX = e.clientX;
      _startY = e.clientY;

      // store draggable/image object position
      _offsetX = parseInt( document.getElementById(imgId[0]).style.left);
      _offsetX = null || isNaN(_offsetX) ? 0 : _offsetX;

      _offsetY = parseInt( document.getElementById(imgId[0]).style.top);
      _offsetY = null || isNaN(_offsetY) ? 0 : _offsetY;

      // tempurarily store the clicked draggable/image object on mousemove
      _temp =  document.getElementById(imgId[0]);
      _temp.style.zIndex=index;
      index=index+1;
     
      window.onmousemove = MouseMove;
     
      return false;
    }
    else
    {
      if(target.className=="anchor")
      { 
         
         
        _startX = e.clientX;
        _startY = e.clientY;
     
        // store draggable/image object position
        _offsetX = parseInt(target.style.left);
        _offsetX = null || isNaN(_offsetX) ? 0 : _offsetX;
        _offsetY = parseInt(target.style.top);
        _offsetY = null || isNaN(_offsetY) ? 0 : _offsetY;
     
        // temporarily store the clicked draggable/image object on mousemove
        _temp = target;

        var imgId=e.target.id.split(" ");
        cur =  document.getElementById(imgId[0]);
        // call mousemove function on mousemove event.
        window.onmousemove = Resize;

      }
      else{
        if(target.className=="anchor_delete") //|| target.className=="anchor_rotate)
        {

        }
        else
        {
          $('.anchor').remove();
          $('.anchor_delete').remove();
         // $('.anchor_rotate').remove();
          $('.nhan_image').css({"border-style":"none"});
        }

      }
    }

  }
  function Resize(e)
  {    if (e == null) 
    var e = window.event; 
    var l=(_offsetX + e.clientX - _startX) ;
    var t=(_offsetY + e.clientY - _startY) ;

    if(l<(parseInt(cur.style.left)+10) )
    {
      l=parseInt(cur.style.left)+10;

    }
    if(t<(parseInt(cur.style.top)+10) )
    {
      t=parseInt(cur.style.top)+10;

    }
    _temp.style.left =l + 'px';
    _temp.style.top = t+ 'px';
    $(cur).textfill();
    var w=parseInt(_temp.style.left)-parseInt(cur.style.left);
    var h=parseInt(_temp.style.top)-parseInt(cur.style.top);
    
    if(w<10) w=10;
    if(h<10) h=10;
    cur.style.width=w+"px";  
    cur.style.height=h+"px";
    //document.getElementById(cur.id+" bottom-left").style.top=parseInt(cur.style.top)+parseInt(cur.style.height);

  }
  function MouseMove(e) {
 
    area.style.borderStyle="solid";
    area.style.borderColor="gray";
    area.style.borderWidth="1px";
          // replacing dragged location left & top on draggable/image object
        _temp.style.left = (_offsetX + e.clientX - _startX) + 'px';
        _temp.style.top = (_offsetY + e.clientY - _startY) + 'px';

   


  }

  function MouseUp(e) {
    if (_temp != null) {
      // we'll not capture any location on mouse release, as our dragging is complete now.  
      window.onmousemove = null;
      _temp = null;
      area.style.borderStyle="none";
    }
  }


  //onSelected image
function onSelected(id)
{

  
  var img=document.getElementById(id);
  img.style.borderStyle="dashed";
  img.style.borderWidth="1px";
  img.style.borderColor="gray";


  var x = document.createElement("div");
  var xId =id+" bottom-right";
  x.setAttribute("id",xId);
  x.setAttribute("style", "position:absolute");
  x.setAttribute("class","anchor");
  
  area.appendChild(x);
  x.style.zIndex=img.style.zIndex;


  x.style.left=parseInt(img.style.left)+parseInt(img.style.width)+'px';
  x.style.top=parseInt(img.style.top)+parseInt(img.style.height)+'px';

  var y=document.createElement("IMG");
  var yId=id+" top-left";
  y.setAttribute("id",yId);
  y.setAttribute("class","anchor_delete");
  y.setAttribute("style","position:absolute");
  y.setAttribute("onclick","delete_img(id)")
 
  area.appendChild(y);
  y.style.zIndex=img.style.zIndex;
  y.style.left=parseInt(img.style.left) -15+'px';
  y.style.top=parseInt(img.style.top)-15+'px';
  y.src="\image\\icon-delete.png";

  /*var z=document.createElement("IMG");
  var zId=id+" bottom-left";
  z.setAttribute("id",zId);
  z.setAttribute("class","anchor_delete");
  z.setAttribute("style","position:absolute");
  z.setAttribute("onclick","rotate_image(id)")
 
  area.appendChild(z);
  z.style.zIndex=img.style.zIndex;
  z.style.left=parseInt(img.style.left) -15;
  z.style.top=parseInt(img.style.top)+parseInt(img.style.height);
  z.src="\images\\icon-fliph.png";*/
}
function delete_img(id)
{
  id= id.split(" ");
  document.getElementById(id[0]).remove();
  $('.anchor').remove();
  $('.anchor_delete').remove();
}
/*function rotate_image(id)
{

  id= id.split(" ");

  id=id[0];

  var img= document.getElementById(id);
  if(img.style.transform)
  {
    img.style.transform="";
    img.style.filter="";
  }
  else
  {
    img.style.transform="scale(-1,1)";
    img.style.filter="FlipH";
  }


  
}*/
function getPosition( element ) {
  var rect = element.getBoundingClientRect();
  return {x:rect.left,y:rect.top};
}

function Rotate()
{
  var shirt =document.getElementById("shirt-area");
  var shirt_back =document.getElementById("shirt-back-area");

  if(shirt.style.display=="none")
  {
    shirt.style.display="block"
    shirt_back.style.display="none"
    area =document.getElementById("design-area");
  }
  else
  {
    shirt.style.display="none"
    shirt_back.style.display="block"
    area =document.getElementById("design-back-area");
  }
}
function Zoom()
{
  
  if(shirt_front.style.display=="none")
  {
    document.getElementById("design-back-shirt").style.transform= "scale(1.5)";
    document.getElementById("design-back-area").style.transform= "scale(1.5)";
  }
  else{
    document.getElementById("design-shirt").style.transform= "scale(1.5)";
    document.getElementById("design-area").style.transform= "scale(1.5)";
  }

 return;
}
function Smaller()
{
  if(shirt_front.style.display=="none")
  {
    document.getElementById("design-back-shirt").style.transform= "scale(1.0)";
    document.getElementById("design-back-area").style.transform= "scale(1.0)";
  }
  else{
    document.getElementById("design-shirt").style.transform= "scale(1.0)";
    document.getElementById("design-area").style.transform= "scale(1.0)";
  }

 return;
}
function ResetAll()
{
  $('.nhan_image').remove();
  location.reload();
}
function addtext()
{
  var text= document.getElementById("text_box").value;
  var font=document.getElementById("select").value;

  var color=document.getElementById("text_color").value;
  font=fonts[font];

  var id="image"+index;
  index=index+1;

  var x=createParent(id);
      x.style.width="150px";
      x.style.height="80px";

  var y= document.createElement("span");
  
  y.setAttribute("class","text_content");
  y.setAttribute("id",id);
  y.setAttribute("style","position:absolute");
  y.innerText=text;
 
  x.appendChild(y);
  y.style.fontFamily=font;
  y.style.color=color;
  $(x).textfill();
  
  

  return false;
}


function createParent(id)
{
     var x = document.createElement("div");
    
    x.setAttribute("alt", "Họa tiết");
    x.setAttribute("id",id);
    x.setAttribute("style", "position:absolute; left:" + 0 + "px; top:" + 0 + "px");

    x.setAttribute("class","nhan_image");
    x.setAttribute("onclick","onSelected(id)");
    
    if(shirt_front.style.display=="none")
    {
      document.getElementById("design-back-area").appendChild(x);
    }
    else
    {
      document.getElementById("design-area").appendChild(x);
    }
    x.style.width="100px";
    x.style.height="100px";
    x.style.left="85px";
    x.style.top="100px";
    return x;
}

function open_Store()
{
  if(document.getElementById("hidden_data_email").value!="")
  {
    modal.style.display = "block";
  }
  else
  {
    alert("Vui lòng đăng nhập để dùng tính năng này");
  }
 
  /*
  email= document.getElementById("hidden_data_email").value;
  $.ajax({
    url: '/' + email,
    type: 'GET',
    success: function () {
        
    }
  })
  */
 // $('#btn_modal_delete').removeClass('active');
 // $('#btn_modal_use').removeClass('active');
 // $('#btn_modal_delete').addClass('disabled');
  //$('#btn_modal_use').addClass('disabled');
}

(function($) {

  
 
    $('#btn_modal_delete').on('click', function (event) 
    {
      event.preventDefault();

      var id = img_modal.id;
      if(id.indexOf("new_img")<0)
      {
        $.ajax({
          url: '/' + id,
          type: 'DELETE',
          success: function () {
              
          }
        })
      }
      
      alert(id);
      document.getElementById(id).remove();

    })
 

 
})(jQuery);

(function($) {

  $.fn.textfill = function(maxFontSize) {
      maxFontSize = parseInt(maxFontSize, 10);
      return this.each(function(){
          var ourText = $("span", this),
              parent = ourText.parent(),
              maxHeight = parent.height(),
              maxWidth = parent.width(),
              fontSize = parseInt(ourText.css("fontSize"), 10),
              multiplier = maxWidth/ourText.width(),
              newSize = (fontSize*(multiplier-0.1));
              if(newSize <= 5) newSize=5;
          ourText.css(
              "fontSize", 
              (maxFontSize > 0 && newSize > maxFontSize) ? 
                  maxFontSize : 
                  newSize
          );
      });
  };
})(jQuery);

function uploadEx() {

  if(document.getElementById("hidden_data_email").value=="")
  {
    alert("Vui lòng đăng nhập để sử dụng tính năng này")
    return;
  }
  var dataURL = mycanvas.toDataURL("image/png");
  var dataURL_back= mycanvas_back.toDataURL("image/png");
  document.getElementById('hidden_data').value = dataURL;
  document.getElementById('hidden_data_back').value = dataURL_back;

  
  var fd = new FormData(document.forms["form1"]);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/', true);

  xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
          var percentComplete = (e.loaded / e.total) * 100;
          console.log(percentComplete + '% uploaded');
          alert('Succesfully uploaded');
          
      }
  };

  
  xhr.onload = function() {

  };
  xhr.send(fd);

  var x = document.createElement("img");
  var id=curID;
  curID++;

  x.setAttribute("alt", dataURL_back);
  x.setAttribute("id",id);
  x.setAttribute("src",dataURL)
  x.setAttribute("class","modal_image")
  x.setAttribute("onclick","Choose_Img_Modal(id)");

  document.getElementById("modal-image-list").appendChild(x);
  x.style.height="240px";
  x.style.width="240px";
  

};

function SendToCart() {

  

  var dataURL = mycanvas.toDataURL("image/png");
  var dataURL_back= mycanvas_back.toDataURL("image/png");

  var quantity =$("#pd_quantity").val();
 
  var size = $("#i-select-size li.selected span").text();


  document.getElementById('hidden_data').value = dataURL;
  document.getElementById('hidden_data_back').value = dataURL_back;
  document.getElementById('hidden_data_quantity').value=quantity;
  document.getElementById('hidden_data_size').value=size;
  document.getElementById('hidden_data_cookie').value=makeid();
  
 
  var fd = new FormData(document.forms["form1"]);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/order', true);

  xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
          var percentComplete = (e.loaded / e.total) * 100;
          console.log(percentComplete + '% uploaded');
          alert('Succesfully uploaded');
          
      }
  };

  
  xhr.onload = function() {

  };
  xhr.send(fd);

  
  

};

function findLastID()
{
  list=document.getElementsByClassName("modal_image");
  var max=0;
  
  for(i=0;i<list.length;i++)
  {
    if(list[i].id>max)
    {
      max=list[i].id;
    }
  }
  max=parseInt(max)+1;
  return max;
}

/*
(function($) {
  $('#addForm').on('submit', function (event) {
      event.preventDefault();
     
      //var url = $('#inputComment').val();
      var image=mycanvas.toDataURL();
      //var customproductContent = {};
     
     
      //document.getElementById("demo").value=image;
      //customproductContent.url  = "AAAA";
     

       $.ajax({
        type: 'POST',
        url: '/',
        data: '{ "imageData" : "' + Pic + '" }',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            alert("Done, Picture Uploaded.");
        }
    });
        
      
  });


})(jQuery);
*/
var select = document.getElementById("select");
for(var a = 0; a < fonts.length ; a++){
	var opt = document.createElement('option');
  opt.value = a;
  opt.innerHTML = fonts[a];
	opt.style.fontFamily = fonts[a];
  select.add(opt);
  
}
function fontChange()
{
  var text= document.getElementById("text_box");
  
  text.style.fontFamily=fonts[select.value];
  

}

function load_back_design(print,str)
{
  if(mycanvas_back)
  { 
    document.getElementById("canvas_back").remove();
    
    
  }
  
  var img=document.getElementById("image_save_zone_border");
 
  var re = false;
  if( document.getElementById("shirt-back-area").style.display == "none")
  {
    re=true;
    document.getElementById("shirt-back-area").style.display="block"
    document.getElementById("shirt-area").style.display="none"
  }
  
  html2canvas($(str), {
    onrendered: function(canvas) {
      mycanvas_back= canvas;
        canvas.id="canvas_back";
        canvas.style.width="100%";
        canvas.style.height="100%";
        str_canvas=canvas.toDataURL();
          if(print)
          {
            img.appendChild(canvas);
          }
         
          if(re==true)
          {
            document.getElementById("shirt-back-area").style.display="none";
            document.getElementById("shirt-area").style.display="block"
            re=false;
          }

           
 
          
          return;

      
        // Clean up 
        //document.body.removeChild(canvas);
    }
    
  });

 
  
}
function load_front_design(print,str)
{
  if(mycanvas)
  { 
    document.getElementById("canvas").remove();
    
    
  }
  
  var img=document.getElementById("image_save_zone_border");
 
  var re = false;
  if( document.getElementById("shirt-area").style.display == "none")
  {
    re=true;
    document.getElementById("shirt-area").style.display="block"
    document.getElementById("shirt-back-area").style.display="none"
  }
  
  html2canvas($(str), {
    onrendered: function(canvas) {
        mycanvas= canvas;
        canvas.id="canvas";
        canvas.style.width="100%";
        canvas.style.height="100%";
        str_canvas=canvas.toDataURL();
          if(print)
          {
            img.appendChild(canvas);
          }
         
          if(re==true)
          {
            document.getElementById("shirt-area").style.display="none";
            document.getElementById("shirt-back-area").style.display="block"
            re=false;
          }

           
          load_back_design(true,"#shirt-back-area");
          
          return;

      
        // Clean up 
        //document.body.removeChild(canvas);
    }
    
  });

 
  
}
function load_design() 
{

  

  load_front_design(true,"#shirt-area");
 

  

  



}



function save_as() 
{
 
  Canvas2Image.saveAsPNG(mycanvas);;
 
  return  Canvas2Image.saveAsPNG(mycanvas_back);;
  
}
$(document).ready(function () {

   curID= findLastID();
  var mail =document.getElementById("hidden_data_email").value;
  document.getElementById("hidden_data_email").value= mail.split('/')[0];
  Choose_shirt("https://image.ibb.co/hfJKfS/shirt_1.png","https://image.ibb.co/gv8PYc/shirt_1_back.png");

  document.getElementById("text_box").style.fontFamily=fonts[select.value];
  document.getElementById("text_box").style.color=document.getElementById("text_color").value;
  convertImgToBase64(document.getElementById("design-shirt").src,document.getElementById("design-shirt"));

  $("#text_color").spectrum({
    color: "rgb(0, 0, 0)",    
    showPaletteOnly: true,
    change: function(color) {
        printColor(color);
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});
  

});





$(function () {
  $(":file").change(function () {
      if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = imageIsLoaded;
          reader.readAsDataURL(this.files[0]);
      }
  });
});

function imageIsLoaded(e)
{
 
  var img= document.getElementById("image_upload");
  var zone=document.getElementById("image_upload_zone");
  var border=document.getElementById("image_upload_zone_border");
  document.getElementById("Upload_title").innerText="Nhấn vào ảnh để thêm vào áo"
  zone.style.display="none";
  img.style.display="block"
  
  img.src=e.target.result;
  
  

  //Choose_Img(e.target.result);
};



function close_modal()
{
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}


function ClearPlaceHolder (input) {
  if (input.value == input.defaultValue) {
      input.value = "";
  }
}
function SetPlaceHolder (input) {
  if (input.value == "") {
      input.value = input.defaultValue;
  }
}
function Choose_Img_Modal(id)
{

  //var old=document.getElementsByClassName("selected");
  //old.classList.remove("selected");
  $('.selected_design').removeClass('selected_design');
  img_modal =document.getElementById(id);
  img_modal.classList.add("selected_design");
  $('#btn_modal_delete').removeClass('disabled');
  $('#btn_modal_use').removeClass('disabled');
  $('#btn_modal_delete').addClass('active');
  $('#btn_modal_use').addClass('active');
}

function Use_design()
{
  close_modal();
  $('.nhan_image').remove();
  Choose_shirt_from_modal(img_modal.src,img_modal.alt);
  load_design();
  


}



(function($) {

    //Xử lý sự kiện nhấn chọn size áo
    $("#i-select-size li").on('click', function () {
      //Xóa thẻ hiện đang được chọn
      $("#i-select-size li.selected").removeClass("selected");
      //Cập nhật lại thẻ mới
      $(this).addClass("selected");

      $("#add-to-cart.btn-noradius").prop('disabled', false);
  });

})(jQuery);






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





    function resetCustomization() {
        $("#i-select-size li.selected").removeClass("selected");
    }




    function checkConditionToEnableAddToCartButton() {
        if ($("#i-select-size li").hasClass("selected")) {
            $("#add-to-cart.btn-noradius").prop('disabled', false);
        }
    }

    function updateCart() {
        var cartItems = cart.find('#cart-count'),
            text = parseInt(cartItems.text()) + parseInt(order_quantity);
            cartItems.text(text);
    }




    function makeid() {
      var text = "";
      var possible = "0123456789";
      
      for (var i = 0; i < 9; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      
      return text;
    }