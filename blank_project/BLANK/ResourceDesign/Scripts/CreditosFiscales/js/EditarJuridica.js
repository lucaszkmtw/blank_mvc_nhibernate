////const cuitNuevo = document.getElementById("cuit")

////cuitNuevo.oninput = (e) => {
////    e.target.value = autoFormatCuit(e.target.value)
////}

////function formatCuit() {
////    let cuit = $('#cuit').val()
////    let nuevoCuit = autoFormatCuit(cuit)
////    $('#cuit').val(nuevoCuit)
////}

////function autoFormatCuit(numeroCuit) {
////    try {
////        var cleaned = ("" + numeroCuit).replace(/\D/g, "");
////        var match = cleaned.match(/^(1|)?(\d{0,2})?(\d{0,8})?(\d{0,1})$/);
////        var intlCode = match[1] ? "" : "";
////        return [intlCode,
////            match[2] ? "" : "",
////            match[2],
////            match[3] ? "-" : "",
////            match[3],
////            match[4] ? "-" : "",
////            match[4]].join("")

////    } catch (err) {
////        return "";
////    }
////}

function desplegarLista() {
    $('#switchEsOrganismo').change(function () {
        esOrganismo = $('#switchEsOrganismo').is(":checked");
        if (esOrganismo) {
            $('#listadoOrganismo').show();
            $('#tipoOrganismo').show();
            $('#razonSocial').hide()
        }
        else {
            $('#listadoOrganismo').hide()
            $('#tipoOrganismo').hide();
            $('#razonSocial').show()
        }

    });
 }


 function eventoChange() {
    $('#listaOrganismos').change(function () {
        $('#codOrganismo-Error').hide();

    });
    $('#IdProvincia').change(function () {
        $('#provincia-Error').hide();

    });
    $('#IdPartido').change(function () {
        $('#partido-Error').hide();

    });
    $('#IdLocalidad').change(function () {
        $('#localidad-Error').hide();

    });
}


$('#switchEsOrganismo').change(function () {

    if ($('#switchEsOrganismo').is(":checked")) {
        $('#listadoOrganismo').show();
        $('#razonSocial').hide();
}

else {
        $('#listadoOrganismo').hide();
        $('#razonSocial').show();
}

});


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

function CargarFormulario(){
    $('#cargaDatos').show();
    $('#idCalendario').show()
    $('#razonSocial').hide();
    $('#idCuil').hide();
    tipoEntidad = $('#TipoEntidad').val();
    $('#cargaDomicilio').show();
    $('#botonGuardar').show();
    $('#cargaContacto').show();
}


function ValidacionesJuridica() {

    var cuitLength = $('#cuit').val().length;
    var domicilioActivo = 0;
    var ok = true;
    
    for (var i = 0; i < DomicilioList.length; i++) {
        if (DomicilioList[i].Activo == true)
            domicilioActivo = 1;
    }
    if (domicilioActivo == 1) {
        $('#domicilioObligatorioActivo-error').hide();
    }
    else {
        $('#domicilioObligatorioActivo-error').show();
        ok = false;
    }

    if ($('#razonSocialJuridica').val() == '') {

        var ok = false;
    }

    if ($('#cuit').val() == '') {

        var ok = false;
    }

    if ($('#cuit').val() != '') {
        if (cuitLength < 11) {
            $('#cuit-length-Error').show();
            ok = false;
        }
        else {
            $('#cuit-length-Error').hide();

        }
        if ($('#cuit').val()[0] == '0' ) {
            $('#cuit-min-Error').show();
            ok = false;
        }
        else {
            $('#cuit-min-Error').hide();

        }

    }
   return ok;
}


