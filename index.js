list();

function list(){
    $.get('/users').then(function(result){
        var users = result.data;
        var rows='';
        $.each(users,function(index,user){
            rows+=`<tr id="user_${user.id}"><td>${user.id}</td><td>${user.username}</td><td><button  type="button"  onclick="del(${user.id})" class="btn btn-danger">删除</button></td><td><button  type="button"  onclick="update(${user.id})" class="btn btn-warning">修改</button></td></tr>`;
        })
        $("#userList").append(rows);
    });
}
function add(){
    $('#userModal').modal('show');
}

function save(){
    var user = {username:$('#username').val()};
    var id = $('#userid').val();
    if(id){
        user.id = id;
        $.ajax({
            url:'/users',
            method:'PUT',
            data:user
        }).then(function(result){
            var user = result.data;
            $(`#user_${user.id}`).html(`<td>${user.id}</td><td>${user.username}</td><td><button  type="button"  onclick="del(${user.id})" class="btn btn-danger">删除</button></td><td><button  type="button"  onclick="update(${user.id})" class="btn btn-warning">修改</button></td>`);
            username:$('#username').val('');
            $('#userModal').modal('hide');
        })
    }else{
        $.post('/users',user).then(function(result){
            var user = result.data;
            $("#userList").append(`<tr id="user_${user.id}"><td>${user.id}</td><td>${user.username}</td><td><button  type="button"  onclick="del(${user.id})" class="btn btn-danger">删除</button></td><td><button  type="button"  onclick="update(${user.id})" class="btn btn-warning">修改</button></td></tr>`);
            username:$('#username').val('');
            $('#userModal').modal('hide');
        })
    }

}

function del(id){
    $.ajax({
        url:`/users?id=${id}`,
        method:'DELETE'
    }).then(function(result){
        var user = result.data;
        $(`#user_${id}`).remove();
    });
}

function update(id){
  $.get(`/users?id=${id}`).then(function(result){
    var user = result.data;
    $('#userid').val(user.id);
    $('#username').val(user.username);
      $('#userModal').modal('show');
  });
}
