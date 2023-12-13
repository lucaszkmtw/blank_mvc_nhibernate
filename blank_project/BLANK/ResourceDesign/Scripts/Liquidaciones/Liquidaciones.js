// #################### MODALS ###################### //

function cerrarModalDetalleLiquidacion() {
    $("#DetalleLiquidacion").empty();
    UIkit.modal("#modal-Detalle-Liquidacion").hide();
}
function ModalDetalleLiquidacion(data) {
    let id = data.closest('tr').id;

    $.ajax({
        url: '@Url.Action("DetalleLiquidacion", "Liquidacion")/' + id,
        type: "GET",
        success: function (data) {
            $("#DetalleLiquidacion").empty();
            $("#DetalleLiquidacion").append(data); //El append nos mete la partial que necesitamos en el html
            UIkit.modal("#modal-Detalle-Liquidacion").show();
        },
    });
}

function cerrarModalDetalleInteresLiquidacion() {
    UIkit.modal("#modal-Detalle-Interes-Liquidacion").hide();
}

function ModalDetalleInteresLiquidacion(data) {

    if (Liquidaciones.length == 0) {
        MostrarAlertaSwal("Atención", "¡Se debe calcular una liquidación antes de ver el detalle de los intereses!", "warning");
        return;
    }

    let fecha = $('#fechaLiquidacionInput').val();
    fechaLiquidacion = formatDateAmericano(fecha);
    let id = data.closest('tr').id;

    $.ajax({
        url: '@Url.Action("DetalleInteresLiquidacion", "Liquidacion")/?id=' + id + "&fecha=" + fechaLiquidacion,
        type: "GET",
        beforeSend: function (xhr) {
            showLoadingModal();
        },
        success: function (data) {
            hideLoadingModal();
            $("#DetalleInteresLiquidacion").empty();
            $("#DetalleInteresLiquidacion").append(data); //El append nos mete la partial que necesitamos en el html
            UIkit.modal("#modal-Detalle-Interes-Liquidacion").show();
        },
    });

}



// #################### VALIDACIONES Y CHANGE ###################### //

function ValidacionesLiquidacion() {
    let ok = true;

    let IdTipoLiquidacion = $('#tipoLiquidacion')[0].selectize.getValue();
    let fechaLiquidacion = $('#fechaLiquidacionInput').val();

    if (IdTipoLiquidacion == '') {
        MostrarAlertaSwal("Atención", "Por favor, seleccione el tipo de liquidación", "warning");
        ok = false;
    }

    if (IdCreditos.length == 0) {
        MostrarAlertaSwal("Error", "Se debe liquidar al menos un crédito", "error");
        ok = false;
    }

    if (fechaLiquidacion == '') {
        MostrarAlertaSwal("Atención", "Por favor, seleccione una fecha de liquidación", "warning");
        ok = false;
    }

    return ok;

}

function ValidacionesCalcular() {
    let ok = true;

    if ($('#fechaLiquidacionInput').val() == '') {
        $('#fechaLiquidacion-Error').show();
        ok = false;
    }

    if ($('#tipoLiquidacion')[0].selectize.getValue() == '') {
        $('#fechaLiquidacion-Error').show();
        ok = false;
    }

    return ok;

}

function HabilitarLiquidacion(estado) {
    $('#Liquidar').data("Habilitado", estado)
    if (estado == true)
        $('#recalcular').hide();
    else
        $('#recalcular').show();
}

$('#fechaLiquidacionInput').change(function () {
    $('#fechaLiquidacion-Error').hide();
    HabilitarLiquidacion(false);
    if (fecha = $('#fechaLiquidacionInput').val() != '')
        AplicarFechaLiquidacion();
});

$('#tipoLiquidacion').change(function () {
    $('#fechaLiquidacion-Error').hide();
    HabilitarLiquidacion(false);
    ObtenerTasasLiquidacion();
})
