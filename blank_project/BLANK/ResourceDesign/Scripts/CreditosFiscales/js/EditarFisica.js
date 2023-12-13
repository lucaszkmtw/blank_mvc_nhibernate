/*const cuitNuevo = document.getElementById("cuit")*/

//cuitNuevo.oninput = (e) => {
//    e.target.value = autoFormatCuit(e.target.value)
//}

//function formatCuit() {
//    let cuit = $('#cuit').val()
//    let nuevoCuit = autoFormatCuit(cuit)
//    $('#cuit').val(nuevoCuit)
//}

//function autoFormatCuit(numeroCuit) {
//    try {
//        var cleaned = ("" + numeroCuit).replace(/\D/g, "");
//        var match = cleaned.match(/^(1|)?(\d{0,2})?(\d{0,8})?(\d{0,1})$/);
//        var intlCode = match[1] ? "" : "";
//        return [intlCode,
//            match[2] ? "" : "",
//            match[2],
//            match[3] ? "-" : "",
//            match[3],
//            match[4] ? "-" : "",
//            match[4]].join("")

//    } catch (err) {
//        return "";
//    }
//}


function desplegarLista() {
    $('#switchEsOrganismo').change(function() {
        esOrganismo = $('#switchEsOrganismo').is(":checked");
        if (esOrganismo) {
            $('#listadoOrganismo').show();
            $('#tipoOrganismo').show();
            $('#razonSocial').hide()
        } else {
            $('#listadoOrganismo').hide()
            $('#tipoOrganismo').hide();
            $('#razonSocial').show()
        }

    });
}

function eventoChange() {
    $('#listaOrganismos').change(function() {
        $('#codOrganismo-Error').hide();

    });
    $('#IdProvincia').change(function() {
        $('#provincia-Error').hide();

    });
    $('#IdPartido').change(function() {
        $('#partido-Error').hide();

    });
    $('#IdLocalidad').change(function() {
        $('#localidad-Error').hide();

    });
}

function ValidacionesFisica() {
    var cuilDnitemp = $('#cuit').val().toString().substring(2, 10);
    var cuilDniNumero = parseInt(cuilDnitemp);
    var domicilioActivo = 0;
    var dni = $('#dni').val()

    var ok = true;
    for (var i = 0; i < DomicilioList.length; i++) {
        if (DomicilioList[i].Activo == true)
            domicilioActivo = 1;
    }
    if (domicilioActivo != 1) {
        $('#domicilioObligatorioActivo-error').show();
        ok = false;
    }

    if ($('#cuit').val()[0] == '0') {
        $('#cuit-min-Error').show();
        ok = false;
    }
    else {
        $('#cuit-min-Error').hide();

    }


    if ($('#idTipoDocumento').val() == '' && $('#dni').val() == '' && $('#cuit').val() == '') {
        $('#idTipoDocumento-Error').show();
        $('#documento-Error').show();
        $('#cuit-Error').show();

        ok = false;

    }

    if ($('#idTipoDocumento').val() == '' || $('#dni').val() == '') {
        $('#idTipoDocumento-Error').show();        
        $('#documento-Error').show();

        ok = false;

    }

    //// SI NO CARGA NI DOCUMENTO NI CUIT, MUESTRO ERROR
    //if ($('#idTipoDocumento').val() == '' && $('#dni').val() == '' && $('#cuit').val() == '') {
    //    $('#idTipoDocumento-Error').show();
    //    $('#documento-Error').show();
    //    $('#cuit-Error').show();
    //    ok = false;
    //}

    // SI CARGA NUMERO DE DOC Y NO ELIGE TIPO
    if ($('#idTipoDocumento').val() != '' && $('#dni').val() == '') {
        $('#documento-Error').show();
        $('#idTipoDocumento-Error').hide();
        ok = false;
    }
    if ($('#idTipoDocumento').val() == '' && $('#dni').val() != '') {
        $('#documento-Error').hide();
        $('#idTipoDocumento-Error').show();
        ok = false;
    }

    //SI CARGA SOLO CUIT y NO TIPO Y NUMERO DE DOC
    if ($('#cuit').val() != '' && $('#cuit').val().length < 11) {
        $('#cuitLength-Error').show();
        ok = false;
    }
    else {
        $('#cuitLength-Error').hide();
    }
    //VALIDACIONES SI CARGA EL TIPO DOCUMENTO COMO DNI 
    if ($('#idTipoDocumento').val() == 1) {
        if ($('#dni').val().length < 7) {
            $('#dniLengthMin-Error').show();
            ok = false;
        }
        else {
            $('#dniLengthMin-Error').hide();
        }
        if ($('#dni').val().length > 8) {
            $('#dniLengthMax-Error').show();
            ok = false;
        }
        else {
            $('#dniLengthMax-Error').hide();
        }

        //SI CARGA DNI Y CUIT, Y NO SON IGUALES LOS DATOS
        if ($('#dni').val() != '' && $('#cuit').val() != '') {
            if (cuilDniNumero != $('#dni').val()) {
                $('#cuitDni-Error').show();
                $('#dniCuit-Error').show();
                ok = false;
            }
            else {
                $('#cuitDni-Error').hide();
                $('#dniCuit-Error').hide();
            }
        }
    }
    else {
        $('#dniLengthMax-Error').hide();
        $('#dniLengthMin-Error').hide();
    }

    //if ($('#cuit').val().length == 11 && $('#dni').val() == '' && $('#idTipoDocumento').val() == '') {
    //    $('#idTipoDocumento-Error').hide();
    //    $('#documento-Error').hide();
    //}


    return (ok);
}


function LimpiarCampos() {

    $('#dni').val('');
    $('#idNombre').val('');
    $('#idApellido').val('');
    $('#razonSocialJuridica').val('');
    $('#cuit').val('');
    $('#calleDomicilio').val('');
    $('#numDomicilio').val('');
    $('#pisoDomicilio').val('');
    $('#deptoDomicilio').val('');
    $('#idObservaciones').val('');

    //$('#dirCorreo').val('');
    //$('#nroTelefono').val('');
    $("#listaOrganismos")[0].selectize.clear();
    $("#IdProvincia")[0].selectize.clear();
    $("#IdPartido")[0].selectize.clear();
    $("#IdLocalidad")[0].selectize.clear();
}


$('#switchEsOrganismo').change(function() {

    if ($('#switchEsOrganismo').is(":checked")) {
        $('#listadoOrganismo').show();
        $('#razonSocial').hide();
    } else {
        $('#listadoOrganismo').hide();
        $('#razonSocial').show();
    }
});


function CargarFormulario() {
    $('#cargaDatos').show();
    $('#idCalendario').show()
    $('#razonSocial').hide();
    $('#idCuil').hide();
    tipoEntidad = $('#TipoEntidad').val();
    $('#cargaDomicilio').show();
    $('#botonGuardar').show();
    $('#cargaContacto').show();
}

$('#dni').change(function () {
    $('#documento-Error').hide()
    $('#cuit-Error').hide()
    $('#dni-length-Error').hide();
})

$('#cuit').change(function () {
    $('#documento-Error').hide()
    $('#cuit-Error').hide()
    $('#cuit-length-Error').hide();
})

$('#idTipoDocumento').change(function () {
    let texto = $('#idTipoDocumento').text()
    $('#idTipoDocumento-Error').hide()
    $('#dniLabel').text(texto)
}    
)

///// CODIGO VIEJO ///// 

  // if ($('#listaOrganismos').val() == '') {

    //     $('#codOrganismo-Error').show();
    //     ok = false;
    // }


    // if ($('#IdProvincia').val() == '') {

    //     $('#provincia-Error').show();
    //     ok = false;
    // }


    // if ($('#IdPartido').val() == '') {

    //     $('#partido-Error').show();
    //     ok = false;
    // }


    // if ($('#IdLocalidad').val() == '') {

    //     $('#localidad-Error').show();
    //     ok = false;
    // }