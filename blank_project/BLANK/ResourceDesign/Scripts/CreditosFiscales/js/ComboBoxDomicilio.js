
partidos_dict = {};


$('#IdProvincia').change(function () { ChangeAllPartidos(this.value) })
$('#IdPartido').change(function () { ChangeAllLocalidades(this.value) })
$('#IdLocalidad').change(function () { ChangeCodigoPostal(this.value) })
//$('#IdLocalidad').click(function () {
//})
function AddOptions(selectElement, data) {

    for (var i = 0; i <= data.length - 1; i++) {

        var options = document.createElement('option');
        var $select = $(selectElement).selectize(options);
        var selectize = $select[0].selectize;
        selectize.addOption({ value: data[i]['Id'], text: data[i]['Descripcion'] });

        // se crea el diccionario para enviar a la vista nueva entidad los codigos postales
        partidos_dict[data[i]['Id']] = data[i]['CodPostal']

        /*     selectize.refreshOptions();*/

    }
}


function removeOptions(selectElement) {
    selectElement.selectize.clearOptions();

}


function AddOneOption(selectElement, id, texto) {
    var options = document.createElement('option');
    var $select = $(selectElement).selectize(options);
    var selectize = $select[0].selectize;
    selectize.addOption({ value: id, text: texto });
}

function AddOneOptionInput(selectElement, valor) {
    selectElement.value = valor;

}
function ChangeAllPartidos(id) {
    console.log(id)
    if (id) {
        if ($('#TransferirAccion').val() == '') {

            $.ajax({
                type: 'GET',
                url: GetAllPartidosById + "/?ProvinciaId=" + id,
                dataType: "json",
                success: function (response) {

                    var select = document.getElementById('IdPartido');
                    var selectLocalidad = document.getElementById('IdLocalidad');
                    if(response.data[0] == undefined){
                        removeOptions(select)
                        removeOptions(selectLocalidad)
                        AddOneOption(select, "", "No espeficado")
                        AddOneOption(selectLocalidad, "", "No espeficado")

                    }else{

                        removeOptions(select)
                        AddOptions(select, response.data)
                        partidos_dict = {};
                    }

                },
                error: function (e) {
                }
            });
        }
    }
}

function ChangeAllLocalidades(id) {
    if (id) {
        if ($('#TransferirAccion').val() == '') {

            $.ajax({
                type: "get",
                url: GetAllLocalidesById + "/?PartidoId=" + id,
                dataType: "json",
                success: function (response) {

                    var selectLocalidad = document.getElementById('IdLocalidad');
                    //var transferirAccion = document.getElementById('TransferirAccion');
                    if (response.data[0] == undefined) {
                        removeOptions(selectLocalidad)
                        AddOneOption(selectLocalidad, "", "No espeficado")

                    } else {

                        removeOptions(selectLocalidad)
                        AddOptions(selectLocalidad, response.data)
                        partidos_dict = {};
                    }

                },
                error: function (e) { }
            });
        }

    }
}

function ChangeCodigoPostal(id) {
    if (id) {
        $.ajax({
            type: "get",
            url: GetCodigoPostalByIdLocalidad + "/?LocalidadId=" + id,
            dataType: "json",
            success: function (response) {
                debugger;
                if (idChangeCodigoPostal!= null) {
                    $("#codigoPostal").val(DomicilioList[idChangeCodigoPostal].CodigoPostal)
                } else  {
                    if (response.data != 0) {
                        $('#codigoPostal').val(response.data)
                    }
                    else {
                        $('#codigoPostal').val("")

                    }
                }

                idChangeCodigoPostal = null;
                //

            },
            error: function (e) { }
        });
    }
}
