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


$(document).ready(function () {

    $('.edit').on('click', function(event){
        event.preventDefault();
        $('#addForm').attr('style', 'display: none');
        $('#editForm').removeAttr("style");
        $('#editForm').attr('data-id', $(this).data('id'));
    })

    $('.cancel').on('click', function(event){
        $('#addForm').removeAttr("style");
        $('#editForm').attr('style', 'display: none');
        $('#editForm').removeAttr('data-id');
    })

    $('#addForm').on('submit', function (event) {
        event.preventDefault();
        var id = $(this).data('articles');
        var comment = $('#inputComment').val();
        var commentContent = {};
        commentContent.ArticleId = id;
        commentContent.comment = comment;
        $.ajax({
            url: '/',
            type: 'POST',
            data: JSON.stringify(commentContent),
            contentType: 'application/json',
            success: function () {
                location.reload();
            }
        });
    });

    $('.delete').on('click', function (event) {
        event.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            url: '/' + id,
            type: 'DELETE',
            success: function () {
                location.reload();
            }
        })
    })

    $('#editForm').on('submit', function (event) {
        event.preventDefault();
        var id = $(this).data('id');
        var comment = $('#editComment').val();
        var commentContent = {};
        commentContent.id = id;
        commentContent.comment = comment;
        $.ajax({
            url: '/'+id,
            type: 'PUT',
            data: JSON.stringify(commentContent),
            contentType: 'application/json',
            success: function () {
                location.reload();
            }
        });
    });

    $(".pagination li a").addClass('page-link');
})