$(document).ready(function() {
    aplicarSelectize($('.selectize'));
    AplicarKendo();
    changeEstado();
    eventoChange();
    chequearContenidoVacios();
});
// SI EN EL SWITH DE ES ORGANISMO ES TRUE, DESPLIGA TODOS LOS INPUT PARA ORGANISMO
function desplegarLista() {
    $('#switchEsOrganismo').change(function() {
        esOrganismo = $('#switchEsOrganismo').is(":checked");
        if (esOrganismo) {
            $('#listadoOrganismo').show();
            $('#tipoOrganismo').show();
            $('#razonSocial').hide()
            $('#listadoOrganismosPadres').hide();


        }
        // CASO CONTRARIO DESPLIEGA CAMPOS PARA NO ORGANISMO
        else {
            $('#listadoOrganismosPadres').show();
            $('#listadoOrganismo').hide()
            $('#tipoOrganismo').hide();
            $('#razonSocial').show()


        }

    });
}

// EN EL CASO QUE EL ORGANISMO SEA DEL ESTADO MUESTRA EL CHECKBOX DE SI ES ORGANISMO, Y EL LISTADO DE ORGANISMOS PADRES
function mostrarCheckboxOrganismo() {

    $('#switchEsDelEstado').change(function() {
        esDelEstado = $('#switchEsDelEstado').is(":checked");
        if (esDelEstado) {
            $('#siOrganismo').show();
            $('#listadoOrganismosPadres').show();
        }
        // CASO CONTRARIO ESCONDE EL LISTADO DE PADRES Y LISTADO DE ORGANISMOS
        else {
            estaChequeado = $('#switchEsOrganismo').is(":checked")
            if (estaChequeado) {
                $('#switchEsOrganismo').click();
            }
            $('#siOrganismo').hide();
            $('#listadoOrganismo').hide();
            $('#listadoOrganismosPadres').hide();

        }
    });
}


// FUNCIONES PARA CUANDO EL INPUT SEA CAMBIADO ESCONDE TODOS LOS ERRORES DE SPAN
function eventoChange() {
    // .CHANGE DENTRO DE UNA FUNCION HACE QUE EL SELECTOR ESTA
    $('#listaOrganismos').change(function() {
        $('#codOrganismo-Error').hide();
    });
    $('#IdProvincia').change(function() {
        $('#provincia-Error').hide();
    });
    $('#IdPartido').change(function() {
        $('#partido-Error').hide();
        console.log('hice algo')
    });
    $('#IdLocalidad').change(function() {
        $('#localidad-Error').hide();
    });
    $('#FechaDesde').change(function() {
        $('#fechaDesde-Error').hide();
    });
    $('#idTipoDomicilio').change(function() {
        $('#tipoDomicilio-Error').hide();
    });
    $('#idEntidadPadre').change(function() {
        $('#idEntidadPadre-Error').hide();
    });
    $('#dni').change(function() {
        $('#documento-Error').hide();
    })
    $('#idTipoDocumento').change(function() {
        $('#idTipoDocumento-Error').hide();
    })
    $('#cuitNuevo').change(function() {
        $('#cuit-Error').hide();
    })
    $('#cuitNuevo').change(function () {
        $('#cuitLength-Error').hide();
    })
    $('#cuitNuevo').change(function () {
        $('#cuitDni-Error').hide();
    })
    $('#dni').change(function () {
        $('#dniCuit-Error').hide();
    })
    $('#dni').change(function () {
        $('#dniLengthMin-Error').hide();
    })
}



function Validaciones() {
    var ok = true;
    var tipoEntidad = $('#TipoEntidad').val();
    var switchEstado = $("#switchEsDelEstado").is(":checked");
    var switchOrganismo = $("#switchEsOrganismo").is(":checked");
    if (tipoEntidad == 'J') {

        if (switchEstado) {
            if ($('#idEntidadPadre').val() == '' && switchOrganismo == false) {
                $('#idEntidadPadre-Error').show();
                ok = false;
            }
            if ($('#listaOrganismos').val() == '' && switchOrganismo == true) {

                $('#codOrganismo-Error').show();
                ok = false;
            }
        }

    }

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

    /*valido fecha desde*/
    if ($('#FechaDesde').val() == '') {
        $('#fechaDesde-Error').show()
        ok = false;
    }
    if ($('#idTipoDomicilio').val() == '') {
        $('#tipoDomicilio-Error').show();
        ok = false;
    }


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
    $('#torreDomicilio').val('');
    $('#unidadDomicilio').val('');
    $('#pisoDomicilio').val('');
    $('#deptoDomicilio').val('');
    $('#idObservaciones').val('');
    //$('#dirCorreo').val('');
    //$('#nroTelefono').val('');
    $("#listaOrganismos")[0].selectize.clear();
    $("#IdProvincia")[0].selectize.clear();
    $("#IdPartido")[0].selectize.clear();
    $("#IdLocalidad")[0].selectize.clear();
    $("#idTipoDomicilio")[0].selectize.clear();
}





function CargarFormulario() {
    $('#cargaDatos').show();
    $('#idCalendarioDesde').show();
    $('#idCalendarioHasta').show();

    $('#listadoOrganismo').hide();
    $('#idCuil').hide();
    tipoEntidad = $('#TipoEntidad').val();
    $('#cargaDomicilio').show();
    $('#botonGuardar').show();
    $('#cargaContacto').show();

}

function

    compareDates(date, dates) {
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].getDate() == date.getDate() &&
            dates[i].getMonth() == date.getMonth() &&
            dates[i].getYear() == date.getYear()) {
            return true
        }
    }
}

function compareCuit(Cuit, Cuits) {
    for (var i = 0; i < Cuits.length; i++) {
        if (Cuits[i].getYear() == Cuit.getYear()) {
            return true
        }
    }
}

// // FUNCION QUE REMUEVE TODOS LOS ELEMENTOS DE UN SELECT 
// function removeOptions(selectElement) {
//     selectElement.selectize.clearOptions();

// }


// //funcion para pasar del id del tipo a la Descripcion
// function DatosContacto(tipo, observacion) {
//     this.tipo = tipo;
//     this.observacion = observacion;

//    switch (tipo) {
//         case '1':
//             this.Descripcion = 'TELÉFONO PARTICULAR';
//             break;
//         case '2':
//             this.Descripcion = 'EMAIL PARTICULAR';
//             break;
//         case '3':
//             this.Descripcion = 'TELÉFONO LABORAL';
//             break;
//         case '4':
//             this.Descripcion = 'EMAIL LABORAL';
//             break;
//         case '5':
//             this.Descripcion = 'CELULAR';
//             break;
//         default:
//     }


// }

// // FUNCION QUE SE ENCARGAA CREAR OPCIONES Y PEGARLAS AL SELECT QUE LE PASO POR PARAMETROS, EN ESTE CASO LA DATA QUE LE LLEGA ES POR AJAX

// function AddOptions(selectElement, data) {
//     for (var i = 0; i <= data.length - 1; i++) {

//         var options = document.createElement('option');
//         var $select = $(selectElement).selectize(options);
//         var selectize = $select[0].selectize;
//         selectize.addOption({ value: data[i]['Id'], text: data[i]['Descripcion'] });
//         selectize.refreshOptions();

//     }
// }

// function eventoChangeContacto() {
//     $('#idTipoContacto').change(function() {
//         $('#idTipoContacto-Error').hide();
//     });

//     $('#idObservaciones').change(function() {
//         $('#idObservaciones-Error').hide();
//     });

// };



// ContactosArray = [];
// var cant = 0;
// $('#ButtonContacto').click(function Contactos(e) {
//     /*RemoveAllContactos();*/
//     e.preventDefault();
//     eventoChangeContacto();

//     //con este if anidado, validamos que ninguno de los campos este vacio. En caso de que alguno este vacio, mostramos el error
//     if (($('#idTipoContacto').val() == '') || ($('#idObservaciones').val() == '')) { //hay alguno de los dos vacios?
//         if ($('#idTipoContacto').val() == '') //es el de tipo contacto?
//             $('#idTipoContacto-Error').show();
//         if ($('#idObservaciones').val() == '') //es el de observaciones?
//             $('#idObservaciones-Error').show();


//     } else {

//         //guardo los valores de los campos y creo un objetos datos Contacto
//         var tipoContacto = $('#idTipoContacto').val();
//         var observaciones = $('#idObservaciones').val();
//         var contacto = new DatosContacto(tipoContacto, observaciones)


//         //insertamos el html de la nueva fila de la tabla con javascript
//         $('#tablaContacto').find('#datosTabla').append("<tr><td>" + contacto.Descripcion + "</td><td> " + contacto.observacion + "</td><td> <a onclick='removeContacto(this)'><i class='delete uk-icon-hover material-icons'>delete</i></a></td></tr>");

//         //si es la primera fila que se agrega, mostramos la tabla.

//         if (contarFilas() > 0) //el metodo contar filas devuelve la cantidad de filas actuales de la tabla
//             $('#tablaContacto').show();

//         //var contacto = new DatosContacto(tipoContacto, observaciones)
//         //ContactosArray.push(contacto)
//         //$('#DatosContactoArray').val(JSON.stringify(ContactosArray));
//         //UpdateContactosTable(ContactosArray);

//         //limpiamos los valores de los campos
//         $("#idTipoContacto")[0].selectize.clear();
//         $('#idObservaciones').val('');

//     }

// });



// function contarFilas() {
//     var $num = document.getElementById('tablaContacto').getElementsByTagName('tr').length - 1;
//     return $num;
// }


// //funcion para eliminar un contacto  de la tabla provisional d contactos
// function removeContacto(data) {

//     data.closest('tr').remove();
//     //ContactosArray.pop(index-1);
//     //RemoveAllContactos();
//     //UpdateContactosTable(ContactosArray)
//     filas = contarFilas();
//     if (filas == 0) //si luego de eliminar, la cantidad de filas es 0, oculto la tabla
//         $('#tablaContacto').hide();

// }

// //  CREA UNA LISTA DE LOS CONTACTOS QUE HAY EN LA TABLA
// function CreateArrayTable() {

//     //var tds = document.querySelectorAll('tbody tr'),
//     var tds = document.querySelectorAll('#datosTabla tr')
//     for (i = 0; i < tds.length; i++) {
//         var row = tds[i]
//         tipoContacto = null;

//         switch (row.cells[0].innerText) {
//             case 'TELÉFONO PARTICULAR':
//                 tipoContacto =1;
//                 break;
//             case 'EMAIL PARTICULAR':
//                 tipoContacto =2;
//                 break;
//             case 'TELÉFONO LABORAL':
//                 tipoContacto =3;
//                 break;
//             case 'EMAIL LABORAL':
//                 tipoContacto =4;
//                 break;
//             case 'CELULAR':
//                 tipoContacto =5;
//                 break;
//             default:
//         }

//        observaciones = row.cells[1].innerText
//         var contacto = new DatosContacto(tipoContacto, observaciones)
//         ContactosArray.push(contacto)
//     }

// }
