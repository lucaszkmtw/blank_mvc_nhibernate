//DESDE LA URL EN DONDE ESTAMOS PARADOS, AGARRA EL ID DE LA ENTIDAD

let currentDomicilio;
var idChangeCodigoPostal;
/*
 * # ---------------  LOGICA DE ESTE SCRIPT ------------------- #
 *
 * DESCRIPCION:
 *
 * Este script nos sirve para interactuar con el campo de domicilio del usuario
 *
 * LOGICA DE SEGUIMIENTO:
 *
 * En este tipo de SCRIPTS los dividiremos en 3 secciones: PROLOGO - DESARROLLO - FINAL
 *
 * PROLOGO: durante el prologo lo que hacemos en TRAER de la base de datos todos los datos del usuario, en este caso, todos los domicilio.
 * Paso seguido, generaremos una copia de estos datos y los almacenaremos en una lista. Esta lista nos sera util para cualquier tipo de accion
 * o modificacion que el TIPO de usuario tenga permitido ejectura (agregar, eliminar, editar, etc)
 *
 * DESARROLLO: durante el desarrollo, el usuario tendra a disposicion un conjunto de herramientas (o acciones), para ajustar estos datos
 * a su antojo. Todos los cambios se haran SOBRE LA COPIA FORMULADA EN LA LISTA y no se accedera a base de datos nuevamente hasta que se llegue al FINAL
 *
 * FINAL: en el final usaremos la copia modificada por el usuario para comunicarle al CONTROLLER como se deben ver los datos (domicilios) del
 * usuario, y el SERVICE se hara cargo de subirlos a la BD
 *
 */


// ############ FUNCIONES DEL PROLOGO ############### // 

/// 1. Obtenemos los datos del usuario de la base de datos (en este caso, domicilios) y generamos una COPIA en una LISTA

DomicilioList = []

function obtenerDomicilios() {
    $.ajax({
        type: "GET",
        url: getDomicilios+ "/" + EntidadID,
        success: function (response) {

            debugger;
            for (var i = 0; i <= response.data.length - 1; i++) {
                var localidad_descripcion;
                if(response.data[i].Localidad == null)
                { localidad_descripcion = null }else{
                    localidad_descripcion= response.data[i].Localidad.Descripcion
                }
                if(response.data[i].Partido == null)
                { partido_descripcion = null }else{
                 partido_descripcion = response.data[i].Partido.Descripcion
                }
                domicilio = new DomicilioEntidad(
                    response.data[i].Id,
                    response.data[i].TipoDomicilio['Id'],
                    response.data[i].IdProvincia,
                    response.data[i].IdLocalidad,
                    response.data[i].IdPartido,
                    response.data[i].CodigoPostal,
                    response.data[i].Calle,
                    response.data[i].Numero,
                    response.data[i].Piso,
                    response.data[i].Depto,
                    response.data[i].Torre,
                    response.data[i].Unidad,
                    response.data[i].ObservacionesDom,
                    response.data[i].Provincia.Descripcion,
                    localidad_descripcion,
                    partido_descripcion,
                    response.data[i].TipoDomicilio.Descripcion,
                    false,
                    response.data[i].Activo
                )

                DomicilioList.push(domicilio)
            }

            actualizarTabla(DomicilioList);
            chequearContenidoVacios();

        },
        error: function(e) {

        }
    });

}

/// 2. Para generar la lista, se utiliza este OBJETO, cuyas propiedades se acoplan a los campos que podemos llenar para los contactos:

/*
 * CAMPOS DEL OBJETO:
 *
 * Id: ID del contacto, si existe se usa el ID de la BASE DE DATOS, de otra manera, se usa un ID = 0 hasta que llegue la hora de guardarlo
 * Eliminado: Sera un booleano que se utilizara para hacer un borrado logico del contacto
 *
 */

function DomicilioEntidad(Id, IdTipoDomicilio, IdProvincia, IdLocalidad, IdPartido, CodigoPostal, Calle, Numero, Piso, Depto, Torre, Unidad, ObservacionesDom, ProvinciaDesc, LocalidadDesc, PartidoDesc, TipoDomicilioDesc, Eliminado, Activo) {
    this.Id = Id;
    this.IdTipoDomicilio = IdTipoDomicilio;
    this.IdProvincia = IdProvincia;
    this.IdLocalidad = IdLocalidad;
    this.IdPartido = IdPartido;
    this.CodigoPostal = CodigoPostal;
    this.Calle = Calle;
    this.Numero = Numero;
    this.Depto = Depto;
    this.Piso = Piso;
    this.Torre = Torre;
    this.Unidad = Unidad;
    this.ObservacionesDom = ObservacionesDom,
        this.ProvinciaDesc = ProvinciaDesc,
        this.LocalidadDesc = LocalidadDesc,
        this.PartidoDesc = PartidoDesc,
        this.TipoDomicilioDesc = TipoDomicilioDesc,
        this.Eliminado = Eliminado,
        this.Activo = Activo
}

// ############ FUNCIONES DEL DESARROLLO ############### // 

/*
 * 1. Accion AGREGAR domicilio: Esta accion le permitira al usuario agregar un contacto, se abrirar un MODAL para la carga, una vez
 * cargado, se agregara como item nuevo a la LISTA, este nuevo item se usara para informar a la base de datos un nuevo INSERT
 * para generar el contacto
 *
 */

function AgregarDomicilio() {

    UIkit.modal("#modal-Crear-Domicilio").show();
    $('#ButtonDomicilio > span').text('Guardar')
    $('#TransferirAccion').val('')
    limpiarCamposDomicilio();
    $('#agregarDomicilioTitle').text('AGREGAR DOMICILIO')
}

/* 2. Accion EDITAR domicilio: nos abrira un MODAL (similar a agregar contacto), pero nos traera la informacion del domicilio que querramos editar
 * 
 * Esto se logra accediendo al INDEX correspondiente de la LISTA donde se guardo el domicilio (0, 1, 2, 3, etc), y se usan esos datos para llenar el MODAL 
 * y poder editarlo
 * 
 */

function EditarDomicilio(data) {
    let editar = 'true';
    limpiarCamposDomicilio();
    let idDomicilio = data.closest('tr').value;
    currentDomicilio = idDomicilio;

    $('#domicilioId').val(idDomicilio)
   
    $('#agregarDomicilioTitle').text('EDITAR DOMICILIO')
    $('#TransferirAccion').val(editar)

    UIkit.modal("#modal-Crear-Domicilio").show();
    idChangeCodigoPostal = idDomicilio;
    getCamposDomicilio(idDomicilio);
    altair_forms.switches();
}

// 3. Accion ELIMINAR domicilio: al igual que en editar, se obtiene el indice del domicilio respecto a la lista, y se setea el campo ELIMINADO en TRUE, usando una logica de borrado logico

function EliminarDomicilio(data) {
    let ThisRow = data.closest('tr'); /// Obtenemos el index del tr donde esta contenido el contacto que queremos eliminar

    swal({
            title: "¿Desea Eliminar el domicilio?",
            text: "El domicilio no podrá recuperarse",
            icon: "warning",
            buttons: ["Cancelar", "Eliminar"],

            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal({
                    title: "",
                    text: 'Se ha eliminado el domicilio',
                    icon: 'success',
                    buttons: {
                        confirm: "Aceptar"
                    },
                    closeOnClickOutside: false,

                })


                ThisRow.hidden = true;


                DomicilioList[ThisRow.value].Eliminado = true;
                actualizarTabla(DomicilioList);
            }
            //else {
            //    swal("¡Tu domicilio está a salvo!");
            //}

        });
}

// 4. Funcion que llena los campos vacios con un '-' a modo estetico (implementado, falta chequear funcionalidad)


// 5. Funcion que se usa para cerrar el MODAL usado para AGREGAR y EDITAR


function cerrarModalDetalleDomicilio() {
    UIkit.modal("#modal-Crear-Domicilio").hide();
}

$('#cerrarModalDomicilio').click(function(e) {
    e.preventDefault()
    UIkit.modal("#modal-Crear-Domicilio").hide();
})

function cerrarModalDetalleContacto() {
    UIkit.modal("#modal-Crear-Contacto").hide();

}

/* 6. Accion de GUARDAR: esta funcion se usa para que por cada domicilio nuevo que creamos o editamos, se almacene en un objeto
 * y este se almacene en la lista
 * 
 * SI es un domicilio nuevo: se hace un PUSH al final de la LISTA
 * SI es un domicilio existente: se edita el elemento a traves de su INDEX en la LISTA
 * 
 */

$('#formEditarDomicilio').submit(function(e) {
    debugger;
    var validaciones = ValidacionesDomicilio();
    var eliminado = false;
    if ($('#IdLocalidad').val() == "") { var idLocalidadSubmit = null } else { var idLocalidadSubmit = $('#IdLocalidad').val() }
    if ($('#IdPartido').val() == "") { var idPartidosubmit = null } else { var idPartidosubmit = $('#IdPartido').val() }
    if ($('#domicilioActivo').is(":checked") == true) {$('#domicilioObligatorioActivo-error').hide()}
    if (validaciones) {
        domicilio = new DomicilioEntidad(
            0,
            $('#IdTipoDomicilio').val(),
            $('#IdProvincia').val(),
            idLocalidadSubmit,
            idPartidosubmit,
            $('#codigoPostal').val(),
            $('#calleDomicilio').val(),
            $('#numDomicilio').val(),
            $('#pisoDomicilio').val(),
            $('#deptoDomicilio').val(),
            $('#torreDomicilio').val(),
            $('#unidadDomicilio').val(),
            $('#observacionesDomicilio').val(),
            $('#IdProvincia').text(),
            $('#IdLocalidad').text(),
            $('#IdPartido').text(),
            $('#IdTipoDomicilio').text(),
            eliminado,
            $('#domicilioActivo').is(":checked"),
        )
        if ($('#agregarDomicilioTitle').text() == 'EDITAR DOMICILIO') {
            actualizarDomicilio(currentDomicilio);
        } else {
            DomicilioList.push(domicilio)
        }

        swal({
            title: "",
            text: "Se ha registrado el Domicilio con éxito.",
            icon: 'success',
            buttons: {
                confirm: "Aceptar"
            },
            closeOnClickOutside: false
        }).then(() => {

        });
        cerrarModalDetalleDomicilio();
        actualizarTabla(DomicilioList);



    }
})
var idChangeCodigoPostal;
// 7. Funcion que se usa para guardar los cambios editados en un objeto a traves de su INDEX
function actualizarDomicilio(idDomicilio) {
    
    DomicilioList[idDomicilio].IdTipoDomicilio = $('#IdTipoDomicilio').val()
    DomicilioList[idDomicilio].IdProvincia = $('#IdProvincia').val()
  
    DomicilioList[idDomicilio].IdLocalidad = $('#IdLocalidad').val()
    DomicilioList[idDomicilio].IdPartido = $('#IdPartido').val()
    DomicilioList[idDomicilio].CodigoPostal = $('#codigoPostal').val()
    DomicilioList[idDomicilio].Calle = $('#calleDomicilio').val()
    DomicilioList[idDomicilio].Numero = $('#numDomicilio').val()
    DomicilioList[idDomicilio].Piso = $('#pisoDomicilio').val()
    DomicilioList[idDomicilio].Depto = $('#deptoDomicilio').val()
    DomicilioList[idDomicilio].Torre = $('#torreDomicilio').val()
    DomicilioList[idDomicilio].Unidad = $('#unidadDomicilio').val()
    DomicilioList[idDomicilio].ObservacionesDom = $('#observacionesDomicilio').val()
    DomicilioList[idDomicilio].ProvinciaDesc = $('#IdProvincia').text()
    DomicilioList[idDomicilio].LocalidadDesc = $('#IdLocalidad').text()
    DomicilioList[idDomicilio].PartidoDesc = $('#IdPartido').text()
    DomicilioList[idDomicilio].TipoDomicilioDesc = $('#IdTipoDomicilio').text()
    if($('#IdLocalidad').val() == ""){DomicilioList[idDomicilio].IdLocalidad = null}
    if ($('#IdPartido').val() == "") { DomicilioList[idDomicilio].IdPartido = null }
    DomicilioList[idDomicilio].Activo = $('#domicilioActivo').is(':checked')
}

// 8. Funcion que se usa para actualizar la tabla despues de cada accion del usuario (AGREGAR, EDITAR o ELIMINAR) para darle feedback al usuario

function actualizarTabla(DomicilioList) {
    selector = $('#datosTablaDomicilio tr')

    // itemCounter se usa para que no se puedan eliminar todos los domicilios, si este counter == 1, se deshabilita la funcion de borrar
    let itemCounter = 0;

    RemoveAllOptions(selector)
    for (let index = 0; index < DomicilioList.length; index++) {
        if (DomicilioList[index].Eliminado != true) {

            for (const e in DomicilioList) {
                // Se crea la tabla manipulando el dom , y creando nuevos elementos en el mismo
                if (DomicilioList[e].Eliminado == false) itemCounter++;
            }

            //var mostrarMas = "<span id='Mostrar-" + index + "' style='cursor: pointer;' class='material-icons md-24' onclick='mostrarMas(" + index + ")'>expand_more</span >"

            //var botonera = '<a class="uk-animation-toggle" onclick="EditarDomicilio(this)"><i class="uk-icon-hover material-icons md-24">edit</i></a>' + '<a class="uk-animation-toggle" onclick="EliminarDomicilio(this)"><i class="uk-icon-hover material-icons md-24">delete</i></a>';
            //if (itemCounter == 1) {
                var botonera = '<a class="uk-animation-toggle" onclick="EditarDomicilio(this)"><i class="uk-icon-hover material-icons md-24">edit</i></a>';
/*            }*/

            var tr = document.createElement('tr');
            var trVacia = document.createElement('tr');
            var tdVacia = document.createElement('td');
            //var showMore = document.createElement('td')
            var calle = document.createElement('td');
            var numero = document.createElement('td');
            var piso = document.createElement('td');
            var depto = document.createElement('td');
            var torre = document.createElement('td');
            var unidad = document.createElement('td');
            var Provincia = document.createElement('td');
            var Partido = document.createElement('td');
            var localidad = document.createElement('td');
            var CodigoPostal = document.createElement('td');
            var tipoDomicilio = document.createElement('td');
            var observaciones = document.createElement('td');
            var acciones = document.createElement('td');
            var activo = document.createElement('td');
          

       
      




            acciones.setAttribute('width', '10%');
            acciones.className = "uk flex uk-flex-right"

            tr.setAttribute('id', DomicilioList[index].Id);
            tr.value = index;

            trVacia.setAttribute('id', "tr-" + index);
            trVacia.hidden = true;
            tdVacia.setAttribute("colspan", "12")

            calle.textContent = DomicilioList[index].Calle;
            numero.textContent = DomicilioList[index].Numero;
            piso.textContent = DomicilioList[index].Piso
            depto.textContent = DomicilioList[index].Depto;
            torre.textContent = DomicilioList[index].Torre;
            unidad.textContent = DomicilioList[index].Unidad;
            localidad.textContent = DomicilioList[index].LocalidadDesc;
            Partido.textContent = DomicilioList[index].PartidoDesc;
            Provincia.textContent = DomicilioList[index].ProvinciaDesc;
            CodigoPostal.textContent = DomicilioList[index].CodigoPostal;
            observaciones.textContent = DomicilioList[index].ObservacionesDom;
            tdVacia.textContent = DomicilioList[index].ObservacionesDom;
            try { tipoDomicilio.textContent = DomicilioList[index].TipoDomicilioDesc; } catch { tipoDomicilio.textContent = "agregue Tipo"; }
            activo.textContent = DomicilioList[index].Activo;
        
            let activoText = activo.textContent; 

            if (activoText === "true") {
                activoText = "SI"; 
            } else {
                activoText = "NO"; 
            }
    
            activo.textContent = activoText;

            acciones.innerHTML = botonera;

            //tr.appendChild(showMore);
            tr.appendChild(calle);
            tr.appendChild(numero);
            tr.appendChild(piso);
            tr.appendChild(depto);
            tr.appendChild(torre);
            tr.appendChild(unidad);
            tr.appendChild(Provincia);
            tr.appendChild(Partido);
            tr.appendChild(localidad);
            tr.appendChild(CodigoPostal);
            tr.appendChild(tipoDomicilio);
            tr.appendChild(observaciones);
            tr.appendChild(activo)
            tr.appendChild(acciones);
            trVacia.appendChild(tdVacia)

            //Se agrean las tr a la tabla con una tr Vacia, la cual va a contener la informacion de observaciones al desplegarse
            $('#tablaDomicilio tbody').append(tr);
            $('#tablaDomicilio tbody').append(trVacia);
        }


    }
    chequearContenidoVacios();
}





// 9. Funcion para VALIDAR TODOS LOS CAMPOS DE DOMICILIO, hasta que estas validaciones no son todas TRUE, no se deja GUARDAR EN BD

function ValidacionesDomicilio() {
    debugger
    var ok = true;

    $('#domicilioObligatorio-error').hide();


    if ($('#IdTipoDomicilio').val() == '') {

        $('#tipoDomicilio-Error').show();
        ok = false;
    }

    if ($('#IdProvincia').val() == '') {

        $('#provincia-Error').show();
        ok = false;
    }

    // if ($('#IdPartido').val() == '') {

    //     $('#partido-Error').show();
    //     ok = false;
    // }

    // if ($('#IdLocalidad').val() == '') {

    //     $('#localidad-Error').show();
    //     ok = false;
    // }

    if ($('#calleDomicilio').val() == '') {
        ok = false;
    }
    
    if ($('#numDomicilio').val().length >= 10) {
        $('#numero-Error').show();
        ok = false;
    }

    if ($('#deptoDomicilio').val().length > 3) {
        $('#deptoDomicilio-Error').show();
        ok = false;
    }

    return ok;
}

// 10. Funcion que se utiliza para borrar todos los SPAN de error generados

function limpiarCamposDomicilio() {
    
    $('#IdProvincia')[0].selectize.setValue('0');
    $('#IdPartido')[0].selectize.setValue('0');
    $('#IdLocalidad')[0].selectize.setValue('0');
    $('#IdTipoDomicilio')[0].selectize.setValue('0');
    $('#calleDomicilio').val('');
    $('#numDomicilio').val('');
    $('#codigoPostal').val('');
    $('#pisoDomicilio').val('');
    $('#deptoDomicilio').val('');
    $('#torreDomicilio').val('');
    $('#unidadDomicilio').val('');
    $('#observacionesDomicilio').val('');
    $('#numero-Error').hide();
}


// FUNCION QUE LE SETEA EL VALOR DE LOS CAMPOS AL  EDITAR UN MODAL EN ESPECIFICO

function getCamposDomicilio(idDomicilio) {
 
    var partido_select = document.getElementById('IdPartido');
    var localidad_select = document.getElementById('IdLocalidad');
    AddOneOption(partido_select, DomicilioList[idDomicilio].IdPartido, DomicilioList[idDomicilio].PartidoDesc);
    AddOneOption(localidad_select, DomicilioList[idDomicilio].IdLocalidad, DomicilioList[idDomicilio].LocalidadDesc)
    $('#IdProvincia')[0].selectize.setValue(DomicilioList[idDomicilio].IdProvincia);
    ChangeAllPartidos(DomicilioList[idDomicilio].IdProvincia)
    ChangeAllLocalidades(DomicilioList[idDomicilio].IdPartido)
  
 
    $('#IdPartido')[0].selectize.setValue(DomicilioList[idDomicilio].IdPartido);    
    $('#IdLocalidad')[0].selectize.setValue(DomicilioList[idDomicilio].IdLocalidad);
    $('#codigoPostal').val(DomicilioList[idDomicilio].CodigoPostal);
    $('#IdTipoDomicilio')[0].selectize.setValue(DomicilioList[idDomicilio].IdTipoDomicilio);
    $('#calleDomicilio').val(DomicilioList[idDomicilio].Calle);
    $('#numDomicilio').val(DomicilioList[idDomicilio].Numero);
    $('#pisoDomicilio').val(DomicilioList[idDomicilio].Piso);
    $('#deptoDomicilio').val(DomicilioList[idDomicilio].Depto);
    $('#torreDomicilio').val(DomicilioList[idDomicilio].Torre);
    $('#unidadDomicilio').val(DomicilioList[idDomicilio].Unidad);
    $('#observacionesDomicilio').val(DomicilioList[idDomicilio].ObservacionesDom);
    $('#TransferirAccion').val('');
    //$('#domicilioActivo').val(DomicilioList[idDomicilio].Activo);
    replaceDivWithHTMLString(DomicilioList[idDomicilio].Activo)
}



// MEGA FIX - DESPLEGAR LA TR ESCONDIDA PERO CON MAS FACHA SI ES POSIBLE PARA EL FUTURO
// DESPLIEGA LA TR ESCONDIDA Y LA CAMBIA EL ICONO DE ARRIBA HACIA ABAJO

function mostrarMas(index) {

    if ($('#tr-' + index).is(':hidden')) {
        $('#tr-' + index).show()
        $('#Mostrar-' + index).text('expand_less')
    } else {
        $('#tr-' + index).hide()
        $('#Mostrar-' + index).text('expand_more')
    }
}

$('#numDomicilio').change(function() {
    $('#numero-Error').hide();
})

$('#IdTipoDomicilio').change(function() {
    $('#tipoDomicilio-Error').hide();
})


$('#deptoDomicilio').change(function() {
    $('#deptoDomicilio-Error').hide();
})






//Remueve todos los items de un selector pasado por parametro, por ejemplo una tabla que contiene Varios Tr(rows), seran eliminada
function RemoveAllOptions(selector) {

    selector.remove()
}

function replaceDivWithHTMLString(activo) {
    // Get a reference to the div element
    var div = document.getElementById('check-domicilio');
    if (activo == true) {
        var htmlString = '<input id="domicilioActivo" name="domicilioActivo" data-switchery type="checkbox" value="true" checked />';
    } else {
        var htmlString = '<input id="domicilioActivo" name="domicilioActivo" data-switchery type="checkbox" value="false" />';
    }
    // Set the div's innerHTML property to the HTML string
    div.innerHTML = htmlString;
}



// ############### -- FUNCIONALIDADES VIEJAS -- ################## //

// $('#IdTipoDomicilio').val(),
//     $('#IdProvincia').val(),
//     $('#IdLocalidad').val(),
//     $('#IdPartido').val(),
//     $('#calleDomicilio').val(),
//     $('#numDomicilio').val(),
//     $('#deptoDomicilio').val(),
//     $('#pisoDomicilio').val(),
//     $('#torreDomicilio').val(),
//     $('#UnidadDomicilio').val(),
//     $('#observacionesDomicilio').val()

// $.ajax({
//     url: '/CreditosFiscales/GuardarDomicilio',
//     type: "POST",
//     dataType: "json",
//     data: formdata,
//     contentType: false,
//     processData: false,
//     beforeSend: function(xhr) {
//         showLoadingModal();
//     },
//     success: function(data) {
//         hideLoadingModal();
//         swal({
//             title: "",
//             text: data.mensaje,
//             icon: data.tipoMensaje,
//             buttons: {
//                 confirm: "Aceptar"
//             },
//             closeOnClickOutside: false
//         }).then(() => {
//             if (data.tipoMensaje == "success") {

//             }
//         });
//         cerrarModalDetalleDomicilio();
//         obtenerDomicilios();
//     },
//     error: function(result) {
//         hideLoadingModal();

//     }
// });

// $.ajax({
//     url: '/CreditosFiscales/EliminarDomicilio/' + idDomicilio, /// Enviamos el URL junto con el ID del CONTACTO que queremos eliminar
//     type: "POST",
//     success: function(data) {
//         hideLoadingModal();
//         swal({
//             title: "",
//             text: data.mensaje,
//             icon: data.tipoMensaje,
//             buttons: {
//                 confirm: "Aceptar"
//             },
//             closeOnClickOutside: false,

//         })
//         obtenerDomicilios();
//     },

// });
