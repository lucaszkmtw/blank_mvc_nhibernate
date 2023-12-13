//DESDE LA URL EN DONDE ESTAMOS PARADOS, AGARRA EL ID DE LA ENTIDAD

/*
 * # ---------------  LOGICA DE ESTE SCRIPT ------------------- #
 * 
 * DESCRIPCION: 
 * 
 * Este script nos sirve para interactuar con el campo de contactos del usuario
 * 
 * LOGICA DE SEGUIMIENTO:
 * 
 * En este tipo de SCRIPTS los dividiremos en 3 secciones: PROLOGO - DESARROLLO - FINAL
 *
 * PROLOGO: durante el prologo lo que hacemos en TRAER de la base de datos todos los datos del usuario, en este caso, todos los contactos.
 * Paso seguido, generaremos una copia de estos datos y los almacenaremos en una lista. Esta lista nos sera util para cualquier tipo de accion
 * o modificacion que el TIPO de usuario tenga permitido ejectura (agregar, eliminar, editar, etc)
 * 
 * DESARROLLO: durante el desarrollo, el usuario tendra a disposicion un conjunto de herramientas (o acciones), para ajustar estos datos 
 * a su antojo. Todos los cambios se haran SOBRE LA COPIA FORMULADA EN LA LISTA y no se accedera a base de datos nuevamente hasta que se llegue al FINAL
 * 
 * FINAL: en el final usaremos la copia modificada por el usuario para comunicarle al CONTROLLER como se deben ver los datos (contactos) del 
 * usuario, y el SERVICE se hara cargo de subirlos a la BD 
 * 
 */


// ############ FUNCIONES DEL PROLOGO ############### // 


/// 1. Obtenemos los datos del usuario de la base de datos (en este caso, contactos) y generamos una COPIA en una LISTA

ContactoList = []

function obtenerContactos() {

    $.ajax({
        type: "GET",
        url: getDatosContacto + "/" + EntidadID,
        success: function (response) {
            //$("#datosTabla tr").remove();            
            const delete_botton = '<a class="uk-animation-toggle md-24" onclick="eliminarContacto(this)"> <i class="uk-icon-hover material-icons md-24">delete</i></a>'
            let numTelefono;

            for (let i = 0; i < response.data.length; i++) {

                let tr = document.createElement('tr');
                let Tipo = document.createElement('td')
                let Descripcion = document.createElement('td')
                let Detalle = document.createElement('td')
                let Eliminar = document.createElement('td')

                Tipo.textContent = response.data[i]['TipoContacto']['Descripcion']

                //if (ValidarTelefono(response.data[i]['Observaciones'])) {
                //    numTelefono = autoFormatPhoneNumber(response.data[i]['Observaciones'])
                //    Descripcion.textContent = numTelefono
                //}

                //else {
                //    Descripcion.textContent = numTelefono
                //}

                Descripcion.textContent = response.data[i]['Observaciones']
                Detalle.textContent = response.data[i]['Detalle']
                Eliminar.innerHTML = delete_botton

                tr.id = response.data[i].Id
                tr.value = i;

                tr.appendChild(Tipo)
                tr.appendChild(Descripcion)
                tr.appendChild(Detalle)
                tr.appendChild(Eliminar)

                $('#tablaContacto').find('#datosTabla').append(tr);

                contacto = new ContactosEntidad(
                    response.data[i].Id,
                    response.data[i].IdTipoContacto,
                    response.data[i].Observaciones,
                    response.data[i].Detalle,
                    false
                )

                ContactoList.push(contacto)
            }
        },
        error: function (e) {

        }
    });

}

/// 2. Para generar la lista, se utiliza este OBJETO, cuyas propiedades se acoplan a los campos que podemos llenar para los contactos:

/*
 * CAMPOS DEL OBJETO: 
 * 
 * Id: ID del contacto, si existe se usa el ID de la BASE DE DATOS, de otra manera, se usa un ID = 0 hasta que llegue la hora de guardarlo
 * IdTipoContacto: Se define si el contacto es: 1 = Telefono Particular, 2 = Email Particular, 3 = Telefono Laboral, 4 = Email Laboral
 * Observaciones: correspondera a la informacion del contacto, ya sea NUMERO o EMAIL
 * Eliminado: Sera un booleano que se utilizara para hacer un borrado logico del contacto
 * 
 */

function ContactosEntidad(Id, IdTipoContacto, Observaciones,Detalle ,Eliminado) {
    this.Id = Id;
    this.IdTipoContacto = IdTipoContacto;
    switch (this.IdTipoContacto) {
        case 1:
            this.Descripcion = 'TELÉFONO PARTICULAR';
            break;
        case 2:
            this.Descripcion = 'EMAIL PARTICULAR';
            break;
        case 3:
            this.Descripcion = 'TELÉFONO LABORAL';
            break;
        case 4:
            this.Descripcion = 'EMAIL LABORAL';
            break;
        default:
            this.Descripcion = '';
            break
    }
    this.Observaciones = Observaciones,
        this.Detalle = Detalle;
        this.Eliminado = Eliminado;

}

// ############ FUNCIONES DEL DESARROLLO ############### // 


/// 1. FUNCION ELIMINAR: Usamos la propiedad ELIMINADO del objeto, para informar a la APP que este contacto no debe dibujarse en la tabla, 
// y que una vez llegado al final, se debe eliminar de la BD

function eliminarContacto(data) {

    let index = data.closest('tr').value;
    swal({
        title: "¿Desea eliminar el Contacto?",
        text: "El contacto no podrá recuperarse",
        icon: "warning",
        buttons: {
            cancel: "Cancelar",
            confirm: "Aceptar"

        },
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {

                ContactoList[index].Eliminado = true;
                hideLoadingModal();
                swal({
                    title: "",
                    text: 'Se ha eliminado el contacto',
                    icon: 'success',
                    buttons: {
                        confirm: "Aceptar"
                    },
                    closeOnClickOutside: false,

                })
                actualizarContactos();
            }
            //else {
            //    swal("Tu contacto esta a salvo!");
            //}
        });
}

// 2. Funcion para cerrar el modal que utilizaremos para editar

function cerrarModalContacto() {
    UIkit.modal("#modal-Crear-Contacto").hide();
    limpiarCamposContacto();
}

$('#cerrarModalContacto').click(function (e) {
    e.preventDefault();
    UIkit.modal("#modal-Crear-Contacto").hide();
    limpiarCamposContacto()
})

// 3. Accion de AGREGAR: nos abre un modal para que podamos agregar nuevos contactos (se cambiara a AgregarContacto)

function EditarContacto() {

    UIkit.modal("#modal-Crear-Contacto").show();
    $('#idContacto-Error').hide()
    $('#telefonoContacto-error').hide()

}


// 4. Funciones de onchange, que se utilizaran para eliminar campos de span informando errores y datos no cargados

$('#codAreaContacto').change(function () {
    $('#idCodArea-Error').hide()
    $('#idCodAreaValido-Error').hide()
})

$("#idContacto").change(function () {
    $('#idTelefono-Error').hide()
    $('#idDescripcion-Error').hide();
    $('#idContacto-Error').hide();
    $('#idDescripcionEmail-Error').hide();
    $('#idEmail-Error').hide();
})

$("#telefonoContacto").change(function () {
    $('#idDescripcion-Error').hide();
    $('#idTelefono-Error').hide();
})

$("#emailContacto").change(function () {
    $('#idDescripcionEmail-Error').hide();
    $('#idEmail-Error').hide();
})

$('#idContacto').change(function () {
    $('.field-validation-error').hide();
    verificarTipo(this.value);

})

/*
 * 5. Accion AGREGAR contacto: Esta accion le permitira al usuario agregar un contacto, se abrirar un MODAL para la carga, una vez
 * cargado, se agregara como item nuevo a la LISTA, este nuevo item se usara para informar a la base de datos un nuevo INSERT 
 * para generar el contacto
 * 
*/

$('#formEditarContacto').submit(function (e) {

    let Observaciones;
    let Detalle = $("#detalle").val();
    e.preventDefault();
    var formdata = new FormData(this)

    formdata.set('DatosContacto.IdEntidad', EntidadID)
    formdata.set('DatosContacto.Detalle', Detalle)
    if (validacionesContacto()) {

        if ($('#emailContacto').val() != '') {
            Observaciones = $('#emailContacto').val()
        }
        if ($('#telefonoContacto').val() != '') {
            Observaciones = $('#codAreaContacto').val() + $('#telefonoContacto').val()
        }

        contacto = new ContactosEntidad(
            0,
            parseInt($('#idContacto').val()),
            Observaciones,
            Detalle,
            false
        )

        ContactoList.push(contacto)

        swal({
            title: "",
            text: "Se ha registrado el Contacto con éxito.",
            icon: 'success',
            buttons: {
                confirm: "Aceptar"
            },
            closeOnClickOutside: false
        })

        actualizarContactos(); // Se actualiza la tabla
        cerrarModalContacto(); // Se Cierra el modal 
        limpiarCamposContacto(); // Se limpian los campos para que la proxima vez que se habra quede todo limpio
    }
})

function ocultarContactos() {

}

/* 6. Funcion actualizar contactos: se usa para que cada vez que se modifique la tabla (AGREGUE o ELIMINE), se actualice la tabla
 * para darle feedback al usuario de los cambios realizados
*/

function autoFormatPhoneNumber(phoneNumberString) {
    try {
        var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        var match = cleaned.match(/(\d{0,3})?(\d{0,3})?(\d{0,4})?$/);
        return [
            match[1] ? "(" : "",
            match[1],
            match[2] ? ") " : "",
            match[2],
            match[3] ? "-" : "",
            match[3]].join("")

    } catch (err) {
        return "";
    }
}

function actualizarContactos() {
    selector = $('#datosTabla tr')
    RemoveAllOptions(selector)
    const delete_botton = '<a class="uk-animation-toggle md-24" onclick="eliminarContacto(this)"> <i class="uk-icon-hover material-icons md-24">delete</i></a>'
    let numTelefono;
    
    for (let i = 0; i < ContactoList.length; i++) {

        if (ContactoList[i].Eliminado == false) {
            let tr = document.createElement('tr');
            let Tipo = document.createElement('td')
            let Descripcion = document.createElement('td')
            let Detalle = document.createElement('td')
            let Eliminar = document.createElement('td')

            //if (ValidarTelefono(ContactoList[i].Observaciones)) {
            //    numTelefono = autoFormatPhoneNumber(ContactoList[i].Observaciones)
            //    //Descripcion.textContent = numTelefono
            //    Descripcion.textContent = ContactoList[i].Observaciones
            //}

            //else {
            //    Descripcion.textContent = ContactoList[i].Observaciones
            //}

            Descripcion.textContent = ContactoList[i].Observaciones
            Tipo.textContent = ContactoList[i].Descripcion
            Detalle.textContent = ContactoList[i].Detalle
            Eliminar.innerHTML = delete_botton

            tr.id = ContactoList[i].Id
            tr.value = i;

            tr.appendChild(Tipo)
            tr.appendChild(Descripcion)
            tr.appendChild(Detalle)
            tr.appendChild(Eliminar)

            $('#tablaContacto').find('#datosTabla').append(tr);
        }
    }
}

// 7. Funcion para limpiar los campos de span que informen errores

function limpiarCamposContacto() {
    $('#idContacto')[0].selectize.setValue('0');
    $('#codAreaContacto').val('');
    $('#telefonoContacto').val('')
    $('#emailContacto').val('')
    $('#detalle').val('')
    $('#emailContacto-error').hide()
    $('#idCodArea-Error').hide()
    $('#idCodAreaValido-Error').hide()
    $('#telefonoContacto-error').hide()
    $('.field-validation-error').hide()
}

// 8. Funcion que se utiliza para verificar que tipo de contacto se cargo, se EMAIL o TELEFONO

function verificarTipo(data) {

    $('#emailContacto').val('');
    $('#telefonoContacto').val('');

    switch (data) {
        case '1':
            $('#DescripcionTelefono').show();
            $('#DescripcionEmail').hide();
            break;
        case '2':
            $('#DescripcionEmail').show();
            $('#DescripcionTelefono').hide();
            break;
        case '3':
            $('#DescripcionTelefono').show();
            $('#DescripcionEmail').hide();
            break;
        case '4':
            $('#DescripcionTelefono').hide();
            $('#DescripcionEmail').show();
            break;
    }

}

// 9. Funcion que se utiliza para validar la carga de contactos, NO SE PUEDE hacer un SUBMIT hasta que todas estas validaciones esten en TRUE

function validacionesContacto() {

    let ok = true;

    if ($('#idContacto').val() == '') {
        $('#idContacto-Error').show();

        ok = false
    }

    if (CheckState() == 'telefono') {

        if ($('#codAreaContacto').val() == '') {
            $('#idCodArea-Error').show()

            ok = false
        }

        if ($('#codAreaContacto').val() != '' && ValidarTelefono($('#codAreaContacto').val()) == false) {

            $('#idCodAreaValido-Error').show()
            ok = false;
        }

        if ($('#telefonoContacto').val() == '') {

            $('#idDescripcion-Error').show()

            ok = false;
        }

        if ($('#telefonoContacto').val().length < 6) {

            $('#idTelefono-Error').show()

            ok = false;
        }



        if ($('#telefonoContacto').val() != '' && ValidarTelefono($('#telefonoContacto').val()) == false) {

            $('#idTelefono-Error').show()
            ok = false;
        }
    }

    if (CheckState() == 'email') {

        if ($('#emailContacto').val() == '') {

            $('#idDescripcionEmail-Error').show()

            ok = false;
        }

        if ($('#emailContacto').val() != '' && ValidarEmail($('#emailContacto').val()) == false) {
            $('#idEmail-Error').show()
            ok = false;
        }

    }

    return ok
}


// 10. Funcion que se utiliza para verificar que el telefono sea un numero (formato pendiente)

function ValidarTelefono(telefono) {
    let numeros = /^[0-9]+$/;

    if (telefono.match(numeros)) {
        return true;
    }
    else {
        return false;
    }

}

// 10. Funcion que se utiliza para verificar que el EMAIL sea un formato de email valido 

function ValidarEmail(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}

// 11. Funcion que borra las columnas de la una tabla

function RemoveAllOptions(selector) {
    selector.remove()
}

// 12. Funcion que chequea en que TIPO de contacto estamos parados

function CheckState() {

    let state = $('#idContacto').val();

    if (state == '1' || state == '3') { var status = 'telefono' };
    if (state == '2' || state == '4') { var status = 'email' }

    return status;

}


 //// #### FUNCIONALIDADES VIEJAS //// 

/// VALIDAMOS SI LOS CAMPOS ESTAN SELECCIONADOS    

    //if (validacionesContacto()) {
    //    $.ajax({

    //        url: '/CreditosFiscales/GuardarContacto/' + EntidadID,
    //        type: "POST",
    //        dataType: "json",
    //        data: formdata,
    //        contentType: false,
    //        processData: false,
    //        success: function(data) {
    //            hideLoadingModal();
    //            swal({
    //                title: "",
    //                text: data.mensaje,
    //                icon: data.tipoMensaje,
    //                buttons: {
    //                    confirm: "Aceptar"
    //                },
    //                closeOnClickOutside: false,

    //            })

    //            obtenerContactos();
    //            cerrarModalContacto();
    //            limpiarCamposContacto();
    //        },

    //    });

    //}