// ############ INICIO DE SCRIPTS ############ //

$(document).ready(function () {
    AplicarKendo();
    AplicarKendoHasta();
    AplicarKendoHastaModal();
    aplicarSelectize($('.selectize'));
    updateDatatable_EntidadTipoCredito()
    updateDatatable_TipoCredito()
})


function selectCurrentIndex(e) {
    let index = e.closest('tr');
    let fecha = index.querySelector("#org_fecha_baja").innerHTML;

    return fecha;
}


// ############ FUNCIONES DE DATATABLE ############ //

function updateDatatable_EntidadTipoCredito() {
    table_Fisica = $('#tipo-creditos-entidad').dataTable({
        "scrollX": false,
        iDisplayLength: 25,
        aaSorting: [[1, "asc"]],
        dom: agregarDomDatatable(),
        colVis: {
            restore: "Reestablecer",
            showAll: "Mostrar Todas"
        },
        aoColumnDefs: [
            { bSortable: false, aTargets: [4] },
        ],
        "lengthMenu": [[25, 50, 100, 300], [25, 50, 100, 300]],
        buttons: [
            { extend: 'copy', className: 'md-btn md-btn-small', text: 'Copiar' },
            { extend: 'csv', title: 'Listado de Actividades', className: 'md-btn md-btn-small' },
            { extend: 'pdf', title: 'Listado de Actividades', className: 'md-btn md-btn-small', orientation: 'landscape', exportOptions: { columns: [0, 1, 2], }, customize: function (doc) { doc.defaultStyle.alignment = 'landscape'; } },
            { extend: 'print', className: 'md-btn md-btn-small', text: 'Imprimir' }
        ],
        language: agregarLenguajeDatatable(),
    });
}

function updateDatatable_TipoCredito() {
    table_Fisica = $('#tipo-creditos').dataTable({
        "scrollX": false,
        iDisplayLength: 25,
        aaSorting: [[1, "asc"]],
        dom: agregarDomDatatable(),
        colVis: {
            restore: "Reestablecer",
            showAll: "Mostrar Todas"
        },
        aoColumnDefs: [
            { bSortable: false, aTargets: [2] },
        ],
        "lengthMenu": [[25, 50, 100, 300], [25, 50, 100, 300]],
        buttons: [
            { extend: 'copy', className: 'md-btn md-btn-small', text: 'Copiar' },
            { extend: 'csv', title: 'Listado de Actividades', className: 'md-btn md-btn-small' },
            { extend: 'pdf', title: 'Listado de Actividades', className: 'md-btn md-btn-small', orientation: 'landscape', exportOptions: { columns: [0, 1, 2], }, customize: function (doc) { doc.defaultStyle.alignment = 'landscape'; } },
            { extend: 'print', className: 'md-btn md-btn-small', text: 'Imprimir' }
        ],
        language: agregarLenguajeDatatable(),
    });
}


// ############ VALIDACIONES ############ //

function ValidacionesTipoCredito() {
    var ok = true;

    if ($('#codigo').val() == '') {
        $('#codigo-Error').show();
        ok = false;
    }

    if ($('#descripcion').val() == '') {
        $('#descripcion-Error').show();
        ok = false;
    }

    return ok;
}

function formatDate(fecha) {

    fullDate = fecha;

    fullDate = fullDate.replaceAll('-', '/');
    fullDate = fullDate.split(' ');
    var date = fullDate[0].split(/\//);

    var newDate = date[1] + '/' + date[0] + '/' + date[2] + ' ';
    var k = new Date(newDate);

    return k;
}

function ValidacionesTipoCreditoEntidad() {
    var ok = true;
    let fechaHasta = formatDate($('#FechaHasta').val());
    let fechaDesde = formatDate($('#FechaDesde').val());


    if ($('#origen').val() == '') {
        $('#origen-Error').show();
        ok = false;
    }

    if ($('#tipoCredito').val() == '') {
        $('#tipoCredito-Error').show();
        ok = false;
    }

    if ($('#FechaHasta').val() != '' && (fechaDesde > fechaHasta)) {
        $('#fechaInvalidaCarga-Error').show()
        ok = false;
    }

    return ok;
}

// ############ FUNCIONES CHANGE ############ //

$('#codigo').change(function () { $('#codigo-Error').hide() })
$('#descripcion').change(function () { $('#descripcion-Error').hide() })

$('#origen').change(function () { $('#origen-Error').hide() })
$('#tipoCredito').change(function () { $('#tipoCredito-Error').hide() })

$('#FechaHasta').change(function () {
    $('#fechaInvalidaCarga-Error').hide()
})

function obtenerCreditos() {

    $.ajax({
        type: "GET",
        url: '@Url.Action("ObtenerCreditos", "Creditos")',
        success: function (response) {
            console.log(response)
        },
        error: function (e) {
            console.log(e)
        }
    });
}


// ############ SUBMIT DE FORMULARIO CARGA TIPO CREDITO ############ //

$("#formTipoCreditos").submit(function (e) {

    var formdata = new FormData(this);

    e.preventDefault();

    var validaciones = ValidacionesTipoCredito();

    if (validaciones) {
        $.ajax({
            url: '@Url.Action("GuardarTipoCredito", "Creditos")',
            type: "POST",
            dataType: "json",
            data: formdata,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                showLoadingModal();
            },
            success: function (data) {
                hideLoadingModal();
                swal({
                    title: "",
                    text: data.mensaje,
                    icon: data.tipoMensaje,
                    buttons: {
                        confirm: "Aceptar"
                    },
                    closeOnClickOutside: false,

                }).then(() => {
                    obtenerCreditos();
                    window.location.reload();
                });

            },
            error: function (data) {
                hideLoadingModal();
                swal({
                    title: "",
                    text: "Ha ocurrido un error en la carga.",
                    icon: data.tipoMensaje,
                    buttons: {
                        confirm: "Aceptar"
                    },
                    closeOnClickOutside: false,
                })
            }
        });
    }
});

// ############ SUBMIT DE FORMULARIO CARGA TIPO CREDITO ENTIDAD ############ //

$("#formTipoCreditosEntidad").submit(function (e) {

    var formdata = new FormData(this);

    var entidadOrigen = $('#origen').val();
    var tipoCreditoEntidad = $('#tipoCredito').val()
    var fechaDesde = $('#FechaDesde').val();
    var fechaHasta = $('#FechaHasta').val();

    formdata.set('IdEntidad', entidadOrigen)
    formdata.set('IdTipoCredito', tipoCreditoEntidad)
    formdata.set('FechaAlta', fechaDesde)
    formdata.set('FechaBaja', fechaHasta)

    e.preventDefault();

    var validaciones = ValidacionesTipoCreditoEntidad();

    if (validaciones) {
        $.ajax({
            url: '@Url.Action("GuardarTipoCreditoEntidad", "Creditos")',
            type: "POST",
            dataType: "json",
            data: formdata,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                showLoadingModal();
            },
            success: function (data) {
                hideLoadingModal();
                swal({
                    title: "",
                    text: data.mensaje,
                    icon: data.tipoMensaje,
                    buttons: {
                        confirm: "Aceptar"
                    },
                    closeOnClickOutside: false,

                }).then(() => {
                    limpiarCampos();
                    obtenerCreditosEntidad();
                });

            },
            error: function (data) {
                hideLoadingModal();
                swal({
                    title: "",
                    text: data.mensaje,
                    icon: data.tipoMensaje,
                    buttons: {
                        confirm: "Aceptar"
                    },
                    closeOnClickOutside: false,
                })
            }
        });
    }
});

//var addId = $('#mimicTable').dataTable().fnAddData([
//    alarmID,
//    'col2',
//    'col3',
//    'col4',
//    'col5'
//]);

//var theNode = $('#mimicTable').dataTable().fnSettings().aoData[addId[0]].nTr;
//theNode.setAttribute('id', 'alarmNum' + alarmID);

function obtenerCreditos() {
    var addId = $('#tipo-creditos').dataTable();
    let borrar = '<a class="uk-animation-toggle" onclick="EliminarTipoCredito(this)"><i class="uk-icon-hover material-icons md-24">delete</i></a>';

    $.ajax({
        type: "GET",
        url: '@Url.Action("ObtenerCreditos", "Creditos")',
        success: function (response) {
            addId.fnClearTable()
            for (let i = 0; i < response.data.length; i++) {
                addId.fnAddData([
                    response.data[i].Credito,
                    response.data[i].Desc,
                    borrar
                ]);

                var node = addId.fnSettings().aoData[i].nTr;
                node.setAttribute('id', response.data[i].Id);
            }
        },
        error: function (e) {

        }
    });

}

function obtenerCreditosEntidad() {
    var addId = $('#tipo-creditos-entidad').dataTable();
    let botonera = '<a class="uk-animation-toggle" onclick="EditarFechaVigencia(this)"><i class="uk-icon-hover material-icons md-24">edit</i></a>' + '<a class="uk-animation-toggle" onclick="EliminarEntidadTipoCredito(this)"><i class="uk-icon-hover material-icons md-24">delete</i></a>';

    $.ajax({
        type: "GET",
        url: '@Url.Action("ObtenerCreditosEntidad", "Creditos")',
        success: function (response) {
            addId.fnClearTable()
            for (let i = 0; i < response.data.length; i++) {
                addId.fnAddData([
                    response.data[i].Entidad.RazonSocial,
                    response.data[i].TipoCredito.Desc,
                    response.data[i].FechaAltaString,
                    response.data[i].FechaBajaString,
                    botonera
                ]);

                var node = addId.fnSettings().aoData[i].nTr;
                node.setAttribute('id', response.data[i].Id);

                var razonSocial = addId.fnSettings().aoData[i].nTr.cells[0];
                razonSocial.setAttribute('id', 'org_razon_social');

                var tipoCredito = addId.fnSettings().aoData[i].nTr.cells[1];
                tipoCredito.setAttribute('id', 'org_tipo_credito');

                var fechaAlta = addId.fnSettings().aoData[i].nTr.cells[2];
                fechaAlta.setAttribute('id', 'org_fecha_alta');

                var fechaBaja = addId.fnSettings().aoData[i].nTr.cells[3];
                fechaBaja.setAttribute('id', 'org_fecha_baja');
            }

        },
        error: function (e) {

        }
    });

}


//funcion para cuando toco la flecha de ir para atras, tire una advertencia
$('#volverAtras').click(function () {
    swal({
        title: "¿Desea salir sin guardar?",
        text: "Se perderán sus cambios",
        icon: "warning",
        buttons: ["Cancelar", "Continuar"],

        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                window.location.href = '@Url.Action("ListadoExpedientesTmp", "Expedientes")'
            }
        })
})

//################### FUNCIONES DE TIPO CREDITO ########################### //


function EliminarTipoCredito(data) {
    let index = data.closest('tr').id;
    ;
    swal({
        title: "¿Desea eliminar el Tipo de Credito?",
        text: "Los cambios no podrán revertirse",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '@Url.Action("EliminarTipoCredito", "Creditos")/' + index,
                    type: "POST",
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    beforeSend: function (xhr) {
                        showLoadingModal();
                    },
                    success: function (data) {
                        hideLoadingModal();
                        swal({
                            title: "",
                            text: data.mensaje,
                            icon: data.tipoMensaje,
                            buttons: {
                                confirm: "Aceptar"
                            },
                            closeOnClickOutside: false,

                        }).then(() => {
                            obtenerCreditos();
                            window.location.reload();
                        });
                    },
                    error: function (data) {
                        hideLoadingModal();
                        swal({
                            title: "",
                            text: data.mensaje,
                            icon: data.tipoMensaje,
                            buttons: {
                                confirm: "Aceptar"
                            },
                            closeOnClickOutside: false,
                        })
                    }
                });

            }

            else {
                swal("Se han anulado los cambios");
            }
        });
}

//################### FUNCIONES DE TIPO CREDITO ENTIDAD ########################### //

function EditarFechaVigencia(e) {

    $('#fechaInvalida-Error').hide();
    $('#fechaHastaModal-Error').hide();

    let currentDate = selectCurrentIndex(e);
    $('#ModalFechaHasta').val(currentDate);

    $('#currentItem').val(e)

    UIkit.modal("#modal-Editar-TipoCredito").show();
}

function cerrarModalEditarTipoCredito() {
    UIkit.modal("#modal-Editar-TipoCredito").hide()
}

$('#cerrarModalEditarCredito').click(function (e) {
    e.preventDefault();
    UIkit.modal("#modal-Editar-TipoCredito").hide()
})

function EliminarEntidadTipoCredito(data) {
    
    let index = data.closest('tr').id;
    swal({
        title: "¿Desea eliminar la Entidad tipo Credito?",
        text: "Los cambios no podrán revertirse",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '@Url.Action("EliminarEntidadTipoCredito", "Creditos")/' + index,
                    type: "POST",
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    beforeSend: function (xhr) {
                        showLoadingModal();
                    },
                    success: function (data) {
                        hideLoadingModal();
                        swal({
                            title: "",
                            text: data.mensaje,
                            icon: data.tipoMensaje,
                            buttons: {
                                confirm: "Aceptar"
                            },
                            closeOnClickOutside: false,

                        }).then(() => {
                            obtenerCreditosEntidad();
                        });
                    },
                    error: function (data) {
                        hideLoadingModal();
                        swal({
                            title: "",
                            text: data.mensaje,
                            icon: data.tipoMensaje,
                            buttons: {
                                confirm: "Aceptar"
                            },
                            closeOnClickOutside: false,
                        })
                    }
                });

            }

            else {
                swal("Se han anulado los cambios");
            }
        });
}

// ###### aplico kendo CON FUNCION ####### //

    function AplicarKendo() {
        $("#FechaDesde").kendoDatePicker({
            value: new Date('@DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss")'),
            format:"dd/MM/yyyy",
            culture: "es-ES",
            disableDates: function (date) {
                var dates = $("#FechaDesde").data("kendoDatePicker").options.dates;
                if (date != null && date != "undefinded" && date != "") {
                    if (date && compareDates(date, dates)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });
    }

function AplicarKendoHasta() {
    $("#FechaHasta").kendoDatePicker({
        value: null,
        culture: "es-ES",
        disableDates: function (date) {
            var dates = $("#FechaHasta").data("kendoDatePicker").options.dates;
            if (date != null && date != "undefinded" && date != "") {
                if (date && compareDates(date, dates) || date.getDay() === 6 || date.getDay() === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    });
}


function AplicarKendoHastaModal() {

    $("#ModalFechaHasta").kendoDatePicker({
        value: new Date('@DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss")'),
        culture: "es-ES",
        disableDates: function (date) {
            var dates = $("#ModalFechaHasta").data("kendoDatePicker").options.dates;
            if (date != null && date != "undefinded" && date != "") {
                if (date && compareDates(date, dates) || date.getDay() === 6 || date.getDay() === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    });
}


function compareDates(date, dates) {
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].getDate() == date.getDate() &&
            dates[i].getMonth() == date.getMonth() &&
            dates[i].getYear() == date.getYear()) {
            return true
        }
    }
}

function aplicarSelectize(tag) {
    tag.selectize({
        hideSelected: false,
        onDropdownOpen: function ($dropdown) {
            $dropdown
                .hide()
                .velocity('slideDown', {
                    begin: function () {
                        $dropdown.css({ 'margin-top': '0' })
                    },
                    duration: 200,
                    easing: easing_swiftOut
                })
        },
        onDropdownClose: function ($dropdown) {
            $dropdown
                .show()
                .velocity('slideUp', {
                    complete: function () {
                        $dropdown.css({ 'margin-top': '' })
                    },
                    duration: 200,
                    easing: easing_swiftOut
                });
        },
        onType: function (value) {
            console.log(value);
        }
    });
};

function limpiarCampos() {
    $('#origen')[0].selectize.setValue('0');
    $('#tipoCredito')[0].selectize.setValue('0');
    $('#FechaHasta').val('');
}