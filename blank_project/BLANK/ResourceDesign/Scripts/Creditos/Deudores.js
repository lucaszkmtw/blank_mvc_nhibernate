


function AplicarKendoPrescripcion() {
    $("#fechaNotificacion").kendoDatePicker({
        value: new Date('@DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss")'),
        culture: "es-ES",
        disableDates: function (date) {
            var dates = $("#fechaNotificacion").data("kendoDatePicker").options.dates;
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
