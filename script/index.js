const endPoint = "https://dummyapi.io/data/v1/";

$(document).ready(function () {
    $("#alerta").hide()
    initList()
    $("#crear").click(function () {
        createUser()
    })
    $("#updt").click(function(){
        updtUser()
    })
});

function initList() {
    var page = 0,
        limit = 10,
        total = 0;

    fetchData();

    $(".prev-btn").on("click", function () {
        if (page > 0) {
            page--;
            fetchData();
        }
    });

    $(".next-btn").on("click", function () {
        if (page * limit < total) {
            page++;
            fetchData();
        }
    });

    function fetchData() {
        $.ajax({
            method: "GET",
            url: endPoint + 'user',
            headers: { 'app-id': '6303c342f467931fefb0cedc' },
            data: {
                page: page,
                limit: limit
            },
            success: function (data) {
                var users = data.data;

                console.log(users);

                total = data.total;

                var html = "";

                if(users.length > 0){
                    for (i = 0; i < users.length; i++) {
                        html += "<tr >" +
                            "<td>" + users[i].id + "</td>" +
                            "<td>" + users[i].title + "</td>" +
                            "<td>" + users[i].firstName + "</td>" +
                            "<td>" + users[i].lastName + "</td>" +
                            "<td>" + "<img src=" + users[i].picture + " width='70' height='70'>" + "</td>" +
                            "<td><button class='btn btn-warning btn-sm' data-bs-toggle='modal' data-bs-target='#updtModal' onclick=updtModal('" + users[i].id + "','" + users[i].title + "','" + users[i].firstName + "','" + users[i].lastName + "')>Actualizar</button></td>" +
                            "<td><button class='btn btn-danger btn-sm' onclick=deleteUser('"+ users[i].id + "')>Eliminar" +
                            "</button></td>"+
                            + "</tr>"
                    }
                }else{
                    html += "<h3>No hay registros para mostrar</h3>"
                }
                $("#usertb").html(html);
            },
            error: function () {
            }
        });
    }
}

function createUser() {
    let user = {
        title: $("#title").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val()
    }

    console.log(user);

    $.ajax({
        type: "POST",
        url: endPoint + 'user/create',
        headers: { 'app-id': '6303c342f467931fefb0cedc' },
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: "application/json",
        complete: function (data) {
            console.log(data);
            let mensaje = ""
            if (data != null) {
                mensaje = "Usuario creado correctamente"
            }
            if (data.error != null) {
                mensaje = "problemas al crear en BD consulte con el Administrador"
            }
            $("#alerta").show()
            $("#mensaje").html(mensaje)
            clean()
        }
    })
}

function clean() {
    $("#title").val("")
    $("#firstName").val("")
    $("#lastName").val("")
    $("#email").val("")
    $("#exampleModal").modal('hide')
}

function updtModal(id, title, firstName, lastName, email){
    $("#idUpdt").val(id)
    $("#titleUpdt").val(title)
    $("#firstNameUpdt").val(firstName)
    $("#lastNameUpdt").val(lastName)
    $("#emailUpdt").val(email)
}

function updtUser(){
    let user = {
        title: $("#titleUpdt").val(),
        firstName: $("#firstNameUpdt").val(),
        lastName: $("#lastNameUpdt").val(),
    }

    $.ajax({
        url: endPoint + "user/" + $("#idUpdt").val(),
        method: 'PUT',
        headers: { 'app-id': '6303c342f467931fefb0cedc' },
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: "application/json",
        complete: function(data) {
            let mensaje = ""
            if(data != null){
                mensaje = "Usuario actualizado correctamente"
            }
            if (data.error != null) {
                mensaje = "problemas al crear en BD consulte con el Administrador"
            }
            $("#alerta").show()
            $("#mensaje").html(mensaje)
            initList()
            cleanUpdt()
        }
    })
    console.log(user);
}

function cleanUpdt() {
    $("#titleUpdt").val("")
    $("#firstNameUpdt").val("")
    $("#lastNameUpdt").val("")
    $("#updtModal").modal('hide')
}

function deleteUser(id){
    console.log(id)
    $.ajax({
        method: "DELETE",
        url: endPoint + 'user/' + id,
        headers: { 'app-id': '6303c342f467931fefb0cedc' },
        complete: function(id){
            if(id != null){
                let mensaje = "Usuario eliminado correctamente"
                $("#alerta").show()
                $("#mensaje").html(mensaje)
                initList()
            }else{
                let mensaje = "Ocurrió un error..."
                $("#alerta").show()
                $("#mensaje").html(mensaje)
            }
        }
    })
}