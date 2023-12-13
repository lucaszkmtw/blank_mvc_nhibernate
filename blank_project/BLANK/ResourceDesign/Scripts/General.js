
// #################### COMO USAR ######################################## //


// <script src="~/ResourceDesign/Scripts/General.js"></script>  --> Se importa el js en el documento a usar

//$(document).ready(function () {
//    aplicarSelectizeDetalleLiquidacion($('.selectize'));
//    AplicarKendoFecha($("#fechaLiquidacionInput")); --> (selectorJquery)
//    MinimalDataTable($('#tabla-liquidacion'), 6); --> (selectorJquery, cantidadDeColumnas)
//    MinimalDataTable($('#tabla-tasas-administrativas'), 2);
//})

// ###################################################################### //

var allTH = document.querySelectorAll('thead tr th');
var label = document.querySelectorAll('label')

for (let i = 0; i < allTH.length; i++) {
    allTH[i].setAttribute('style', 'font-weight: bold')

}

for (let i = 0; i < label.length; i++) {
    if (label[i].classList != "ignorarEstilo")
        label[i].setAttribute('style', 'font-weight: bold')

}

function aplicarSelectizeDetalleLiquidacion(tag) {
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

function AplicarKendoFecha(selector) {


    selector.kendoDatePicker({
        format: "dd/MM/yyyy",
        value: null,
        culture: "es-ES",
        disableDates: function (date) {
            var dates = selector.data("kendoDatePicker").options.dates;
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

function compareDates(date, dates) {
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].getDate() == date.getDate() &&
            dates[i].getMonth() == date.getMonth() &&
            dates[i].getYear() == date.getYear()) {
            return true
        }
    }
}

function DataTable_OrdenDinero() {
    // Codigo que nos permite aplicar un formato customizable a una columna de fechas en dataTable

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function (dateStr) {
            var ukDateParts = dateStr.split('/');
            return (ukDateParts[2] + ukDateParts[1] + ukDateParts[0]) || 0;
        },
        "date-uk-asc": function (a, b) {
            return a.localeCompare(b);
        },
        "date-uk-desc": function (a, b) {
            return b.localeCompare(a);
        },

        "currency-pre": function (amountStr) {
            // Eliminar el símbolo de moneda y cualquier separador de miles
            var cleanAmount = amountStr.replace(/[$.]/g, '').replace(/\./g, '');

            // Reemplazar la coma (,) por un punto (.) para permitir la conversión a número
            cleanAmount = cleanAmount.replace(',', '.');

            // Convertir a número flotante
            var amount = parseFloat(cleanAmount);

            // Si el valor es NaN, devolver 0
            return isNaN(amount) ? 0 : amount;
        },
        "currency-asc": function (a, b) {
            return a - b;
        },
        "currency-desc": function (a, b) {
            return b - a;
        }
    });

    table_Juridica = select.dataTable({
        "scrollX": false,
        iDisplayLength: 25,
        aaSorting: [[1, "asc"]],
        dom: agregarDomDatatable(),
        colVis: {
            restore: "Reestablecer",
            showAll: "Mostrar Todas"
        },
        aoColumnDefs: [
            { bSortable: false, aTargets: [columns] },
            { type: 'date-uk', targets: 'date-column' }, // Utiliza la función de orden personalizada y la clase 'date-column' para la columna de fechas
            { type: 'currency', targets: 'money-column' } // Utiliza la función de orden personalizada y la clase 'money-column' para la columna de dineros
        ],
        "lengthMenu": [[25, 50, 100, 300], [25, 50, 100, 300]],
        buttons: [
            { extend: 'copy', className: 'md-btn md-btn-small', text: 'Copiar', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            { extend: 'csv', title: '', className: 'md-btn md-btn-small', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            { extend: 'pdf', title: '', className: 'md-btn md-btn-small', orientation: 'landscape', exportOptions: { columns: [0, 1, 2, 3, 4] }, customize: function (doc) { doc.defaultStyle.alignment = 'landscape'; } },
            { extend: 'print', className: 'md-btn md-btn-small', text: 'Imprimir', exportOptions: { columns: [0, 1, 2, 3, 4] } }
        ],
        language: agregarLenguajeDatatable(),
    });
}

function DataTable(select, columns) {

    // ####### // 


    // Codigo que nos permite aplicar un formato customizable a una columna de fechas en dataTable

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function (dateStr) {
            var ukDateParts = dateStr.split('/');
            return (ukDateParts[2] + ukDateParts[1] + ukDateParts[0]) || 0;
        },
        "date-uk-asc": function (a, b) {
            return a.localeCompare(b);
        },
        "date-uk-desc": function (a, b) {
            return b.localeCompare(a);
        }
    });


    // ######### // 
    table_Juridica = select.dataTable({
        "scrollX": false,
        iDisplayLength: 25,
        aaSorting: [[1, "asc"]],
        dom: agregarDomDatatable(),
        colVis: {
            restore: "Reestablecer",
            showAll: "Mostrar Todas"
        },
        aoColumnDefs: [
            { bSortable: false, aTargets: [0] },
            { bSortable: false, aTargets: [columns] },
            { type: 'date-uk', targets: 'date-column' } // Utiliza la función de orden personalizada y la clase 'date-column' para la columna de fechas
        ],
        "lengthMenu": [[25, 50, 100, 300], [25, 50, 100, 300]],
        buttons: [
            { extend: 'copy', className: 'md-btn md-btn-small', text: 'Copiar', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            { extend: 'csv', title: '', className: 'md-btn md-btn-small', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            { extend: 'pdf', title: '', className: 'md-btn md-btn-small', orientation: 'landscape', exportOptions: { columns: [0, 1, 2, 3, 4] }, customize: function (doc) { doc.defaultStyle.alignment = 'landscape'; } },
            { extend: 'print', className: 'md-btn md-btn-small', text: 'Imprimir', exportOptions: { columns: [0, 1, 2, 3, 4] } }
        ],
        language: agregarLenguajeDatatable(),
    });
}


function MinimalDataTable(select, columns) {
    table = select.dataTable({
        searching: false,
        paging: false,
        info: false,
        "ordering": false,
        "scrollX": true,
        iDisplayLength: 10,
        aaSorting: [],
        dom: agregarDomDatatable(),
        colVis: {
            restore: "Reestablecer",
            showAll: "Mostrar Todas"
        },
        aoColumnDefs: [
            { bSortable: false, aTargets: [columns] },
        ],
        "lengthMenu": [],
        buttons: [],
        language: agregarLenguajeDatatable(),
    });
}


function AddOptions(selectElement, data) {

    for (var i = 0; i <= data.length - 1; i++) {

        var options = document.createElement('option');
        var $select = $(selectElement).selectize(options);
        var selectize = $select[0].selectize;

        if (data[i].Entidad.RazonSocial != null) {
            selectize.addOption({ value: data[i].Id, text: data[i].Entidad.RazonSocial });
        }
        else {
            selectize.addOption({ value: data[i].Id, text: data[i].Entidad.Apellido + ', ' + data[i].Entidad.Nombre });
        }
    }
}

function removeOptions(selectElement) {
    selectElement.selectize.clearOptions();

}


function formatearDateTimeAString(date) {

    if (date == null)
        return " - ";

    let fecha = "";

    if (date != null) {
        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let year = date.getFullYear();

        fecha = dia + "/" + mes + "/" + year
    }

    return fecha;
}

function formatearDateTimeAStringMasPlazo(date, sumar) {

    if (date == null)
        return " - ";

    let fecha = "";

    if (date != null) {
        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let year = date.getFullYear() + sumar;

        fecha = dia + "/" + mes + "/" + year
    }

    return fecha;
}

function formatDate(fecha) {
    if (typeof (fecha) != 'string') {
        console.log("El formato de fecha no es valido!")
        return "-";
    }

    fullDate = fecha;

    fullDate = fullDate.replaceAll('-', '/');
    fullDate = fullDate.split(' ');
    var date = fullDate[0].split(/\//);

    var newDate = date[1] + '/' + date[0] + '/' + date[2] + ' ';
    var k = new Date(newDate);

    return k;
}

function completarCeros(fecha) {
    if (!fecha) {  // Si fecha es nulo, undefined o una cadena vacía
        return '-';
    }

    var partes = fecha.split('/');

    // Se asume que si no hay al menos tres partes, es una fecha no válida
    if (partes.length < 3) {
        return '-';
    }

    var dia = partes[0].padStart(2, '0');
    var mes = partes[1].padStart(2, '0');
    var anio = partes[2];

    return dia + '/' + mes + '/' + anio;
}

function formatDateAmericano(fecha) {

    if (typeof (fecha) != 'string') {
        console.log("El formato de fecha no es valido!")
        return "-";
    }

    fullDate = fecha;

    fullDate = fullDate.replaceAll('-', '/');
    fullDate = fullDate.split(' ');
    var date = fullDate[0].split(/\//);

    var newDate = date[2] + '/' + date[1] + '/' + date[0] + ' ';

    return newDate;
}

function EsFormatoFechaValido(fecha) {    
    let d = new Date(fecha);
    if (isNaN(d.getDate()) || fecha.includes("undefined") || fecha.includes("Date")) {
        return false
    }

    return true;
}

function EsFechaValida(fecha, mensajeError) {

    let d = new Date(fecha);

    if (isNaN(d.getDate()) || fecha.includes("undefined")) {
        mensajeError.show()
        return false
    }

    return true;
}

function formatearFechaTabla(fecha, dias) {
    if (fecha == null) {
        console.log("La fecha no puede ser nula!");
        return;
    }

    if (typeof (fecha) != 'string') {
        console.log('La fecha debe ser un string!')
        return;
    }


    let date = new Date(JSON.parse(fecha.slice(1, -1).slice(5, -1)));

    if (date.getFullYear() == 0) {
        return "-";
    }

    date.setDate(date.getDate() + dias);

    let mes = date.getMonth() + 1
    let anio = date.getFullYear()
    let dia = date.getDate()
    let fullDate = dia + '/' + mes + '/' + anio

    return fullDate;
}

function formatearFechaYHoraJSON(fecha, dias) {
    
    if (fecha == null) {
        console.log("La fecha no puede ser nula!");
        return;
    }

    if (typeof (fecha) != 'string') {
        console.log('La fecha debe ser un string!')
        return;
    }


    let date = new Date(JSON.parse(fecha.slice(1, -1).slice(5, -1)));

    if (date.getFullYear() == 0) {
        return "-";
    }

    date.setDate(date.getDate() + dias);

    let anio = date.getFullYear();
    let mes = date.getMonth() + 1
    let dia;
    let horas;
    let minutos;
    let segundos;

    mes.toString().length < 2 ? mes = '0' + mes : mes = (date.getMonth() + 1);
    date.getDate().toString().length < 2 ? dia = '0' + date.getDate() : dia = date.getDate();
    date.getHours() <= 9 ? horas = '0' + date.getHours() : horas = date.getHours();
    date.getMinutes() <= 9 ? minutos = '0' + date.getMinutes() : minutos = date.getMinutes();
    date.getSeconds() <= 9 ? segundos = '0' + date.getSeconds() : segundos = date.getSeconds();

    let fullDate = dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos + ':' + segundos;

    return fullDate;
}

function formeaterNumeroACuit(numero) {
    // Convierte el número a una cadena para manipularlo
    numero = numero.toString();

    // Verifica si la longitud de la cadena es adecuada
    if (numero.length === 11) {
        // Formatea la cadena según el patrón
        return numero.slice(0, 2) + "-" + numero.slice(2, 10) + "-" + numero.slice(10);
    } else {
        // Si la longitud no es la esperada, devuelve un mensaje de error
        return "Número no válido";
    }
}

function formatearDNI(dni) {
    // Convierte el DNI a una cadena para manipularlo
    dni = dni.toString();

    // Verifica si la longitud de la cadena es adecuada (8 caracteres)
    if (dni.length === 8) {
        // Formatea la cadena agregando puntos decimales
        return dni.slice(0, 2) + "." + dni.slice(2, 5) + "." + dni.slice(5);
    } else {
        // Si la longitud no es la esperada, devuelve un mensaje de error
        return "DNI no válido";
    }
}

function FormatoMontoADinero(monto) {
    const formateador = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    });

    let formato = formateador.format(monto);

    return formato.replace('$', '');
}

function FormatoDineroAFloat(monto) {
    let regex = /([+-]?[0-9|^.|^,]+)[\.|,]([0-9]+)$/igm
    let result = regex.exec(monto);
    let floatResult = result ? result[1].replace(/[.,]/g, "") + "." + result[2] : monto.replace(/[^0-9-+]/g, "");

    return parseFloat(floatResult);
}

function FormatoMontoAFloat(monto) {
    let k = parseFloat(monto.toString().trim().replace(",", "."));
    return k;
}


function MostrarAlertaSwal(titulo, texto, icono) {
    swal({
        title: titulo,
        text: texto,
        icon: icono,
        buttons: {
            confirm: "Aceptar"
        },
        closeOnClickOutside: false,
    })
}

function MostrarAlertaSwalReload(titulo, texto, icono) {
    swal({
        title: titulo,
        text: texto,
        icon: icono,
        buttons: {
            confirm: "Aceptar"
        },
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                window.location.reload();
            }
        });
}

function ObtenerIdItemSelectize(selector) {
    if (selector != '')
        return $(selector)[0].selectize.items[0]
}

function BorrarItemListaByElement(array, item) {

    let index = array.findIndex(e => e == item);
    array.splice(index, 1);
}

function ObtenerCreditoPagoByIdCredito(id) {
    e = CreditosPago.find(element => element.IdCredito == id);
    return e;
}

function BorrarItemByIndex(array, index) {
    array.splice(index, 1);
}

function TrabajoEnProgreso() {
    MostrarAlertaSwal("", "Trabajo en progreso!", "warning");
}


function ObtenerFloatDesdeString(dato) {
    return parseFloat(dato.replace('$', '').trim())
}

function HabilitarBoton(selector) {
    $(selector).prop('disabled', false);
    $(selector).removeClass('md-btn-disabled');
    $(selector).addClass('md-btn-primary');
}

function DeshabilitarBoton(selector) {
    $(selector).prop('disabled', true);
    $(selector).addClass('md-btn-disabled');
}

function HabilitarLink(selector) {
    $(selector).removeClass('no-pointer');
    $(selector).removeClass('md-btn-disabled');
    $(selector).addClass('md-btn-primary');
}

function DeshabilitarLink(selector) {
    $(selector).removeClass('md-btn-primary');
    $(selector).addClass('md-btn-disabled');
    $(selector).addClass('no-pointer');
}

function HabilitarSwitch(select) {
    if (select.prop("checked") == false) {
        select.click()
        return;
    }

    return console.log('Ya esta activo bigote')

}

function DeshabilitarSwitch(select) {
    if (select.prop("checked") == false) {
        select.click()
        return;
    }

    return console.log('Ya esta activo bigote')

}

function test() {
    console.log("hola");
}

function InicializarAcordeon(header, content) {
    var accs = document.querySelectorAll('[id^="' + header + '"]');
    var accc = document.querySelectorAll('[id^="' + content + '"]');

    for (var i = 0; i < accs.length; i++) {
        var headerId = header + "-" + i;
        var contentId = content + "-" + i;

        accs[i].setAttribute("id", headerId);
        accc[i].setAttribute("id", contentId);
        $('#' + headerId).data("activo", false);
    }
}


function ActivarAcordeon(header, content) {
    $('#' + header).addClass("uk-active");
    // $('#' + content).prop("hidden", false);
    $('#' + content).slideDown();
}

function DesactivarAcordeon(header, content) {
    $('#' + header).removeClass("uk-active");
    //$('#' + content).prop("hidden", true);
    $('#' + content).slideUp();
}

function CambiarEstadoAcordeon(e) {
    var arrow = e.querySelector('.uk-accordion-title');

    if (arrow && e.classList.contains('md-card-content')) {
        var header = arrow.id;
        var content = arrow.nextElementSibling.id;

        if ($('#' + header).data().activo) {
            $('#' + header).data().activo = false;
            DesactivarAcordeon(header, content);
        }
        else {
            $('#' + header).data().activo = true;
            ActivarAcordeon(header, content);
        }
    }
}


function ValidarFormatoFecha(fecha) {
    var formatoFecha = /^\d{2}\/\d{2}\/\d{4}$/;
    if (formatoFecha.test(fecha))
        return true;
    return false;
}

function validarEmail(email) {
    // Expresión regular para validar direcciones de correo electrónico
    const expresionRegular = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Usa test() para comprobar si el email coincide con la expresión regular
    return expresionRegular.test(email);
}

function EsFechaPosterior(fecha) {
    
    var compare = moment(fecha.value, 'DD/MM/YYYY');

    // Obtener la fecha actual
    var fechaHoy = moment().startOf('day');

    // Comparar las fechas
    if ((compare.isAfter(fechaHoy)) || compare.isSame(fechaHoy)) { 
        return true;
    }
    else {
        return false;
    }
}

function ValidarFormatoFecha(inputId, errorSpanId)
{
    var formatoFecha = /^\d{2}\/\d{2}\/\d{4}$/;
    var fecha = $("#" + inputId).val();
    var errorSpan = document.getElementById(errorSpanId);
    
    if ((fecha != '') && (fecha != '-')) {
        if (formatoFecha.test(fecha)) {
            errorSpan.hidden = true;
            return true;
        } else {
            errorSpan.hidden = false;
            return false;
        }
    }
    errorSpan.hidden = true;
    return true;
}