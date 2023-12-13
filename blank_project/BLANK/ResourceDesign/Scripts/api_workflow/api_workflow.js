// // FUNCIONES PARA ACTIVIDADES
var url_api_workflow1 = "http://sistemas-desa.ec.gba.gov.ar/api_workflow/api/";
var ListActividades;
function GetAllActividades(token) {


    $.ajax({
        type: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        url: url_api_workflow1 + "Actividad",
        dataType: "json",
        success: function (response) {
            ListActividades = response;
        }
    });


}

function AgregarActividad(data, token) {

    var jsondata = JSON.stringify(data)
    $.ajax({
        type: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: url_api_workflow1 + "Actividad",
        data: jsondata,
        dataType: "json",
        success: function (response) {
            console.log(response)
        }
    });

}


function UpdateActividad(data, token) {

    var jsondata = JSON.stringify(data)
    console.log(jsondata)
    $.ajax({
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: url_api_workflow + "Actividad/" + data.Id,
        data: jsondata,
        dataType: "json",
        success: function (response) {
            console.log(response)
        },
        error: function (error) {
            console.log(error)
        }
    });

}

// GET ALL USUARIOS
function GetAllUsuarios(token) {


    $.ajax({
        type: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        url: url_api_workflow1 + "Usuario",
        dataType: "json",
        success: function (response) {
            console.log(response)
        }
    });


}

// ADD USUARIOS AL SELECT DE USUARIO-ACTIVIDAD



//GET ALL SISTEMAS 
function GetAllSistemas(token) {

    var sistemasList = "";
    $.ajax({
        type: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        url: url_api_workflow1 + "Sistemas",
        dataType: "json",
        success: function (response) {
            debugger;
            console.log(response)
            sistemasList = response;
        }

    });

    return sistemasList;
}


function AddUsuariosToSelect(token) {
    debugger;
    selectElement = document.getElementById("SelectSistema")

    $.ajax({
        type: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        url: url_api_workflow + "Sistemas",
        dataType: "json",
        success: function (data) {
            for (var i = 0; i <= data.length - 1; i++) {
                debugger;
                var options = document.createElement('option');
                var $select = $(selectElement).selectize(options);
                var selectize = $select[0].selectize;
                selectize.addOption({ value: data[i]['cId'], text: data[i]['dDescripcion'] });

                // se crea el diccionario para enviar a la vista nueva entidad los codigos postales

                /*     selectize.refreshOptions();*/

            }

        }

    });

}
