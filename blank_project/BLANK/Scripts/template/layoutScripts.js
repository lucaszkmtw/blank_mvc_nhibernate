
$(function () {
    //$(document).ready(function () {
    if (isHighDensity) {
        // enable hires images
        altair_helpers.retina_images();
    }
    if (Modernizr.touch) {
        // fastClick (touch devices)
        FastClick.attach(document.body);
    }
});

function loadingModal() {
    if ($('#modal_loading') != undefined || $('#modal_loading') != null) {
        if ($('#modal_loading') != undefined || $('#modal_loading') != null) {
            return $.UIkit.modal("#modal_loading", { keyboard: false, bgclose: false });
        }
    }
}

 function completarConCeros(str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
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
        }
    });
};

function aplicarSelectizeMultiple() {
    $('.selectizeMulti').selectize({
        plugins: {
            'remove_button': {
                label: ''
            }
        },
        persist: false,
        maxItems: null,
        onItemAdd: function () {
            this.blur();
        },
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
                })
        }
    });
}


function addCerosToStr(str, max) {
    str = str.toString();
    return str.length < max ? addCerosToStr("0" + str, max) : str;
}


$(document).ready(function () {
    localStorage.clear();
    //    addStylesFab();
    //    $("#change_sidebar").click(function () {
    //        if ($("body").hasClass('sidebar_mini')) {
    //            localStorage.removeItem('altair_sidebar_mini');
    //            altair_main_sidebar.init();
    //        } else {
    //            localStorage.setItem("altair_sidebar_mini", '1');
    //            altair_main_sidebar.init(); 
    //        }       
    //    });
    //    $(window).resize(function () { resizeSigaf() });
    //});

    //function resizeSigaf() {    
    //    if ($(window).width() < 1223) {
    //        if (!$("body").hasClass("sidebar_mini")) {
    //            localStorage.setItem("altair_sidebar_mini", '1');
    //            altair_main_sidebar.update();  
    //            //addStylesFab();
    //        }
    //    }
});

/*scripts del anterior GEP*/
jQuery.fn.setFormTimeout = function () {
    var $form = $(this);
    setTimeout(function () {
        $('input[type="submit"]', $form).button('reset');
        alert('Form failed to submit within 30 seconds');
    }, 30000);
};

function cleanSelectizeValues(tag, valPorDefecto = 0) {
    /**
        * El valor por defecto del tag que utiliza selectize debe tener el valor -1
        */
    var $select = tag.selectize();
    var selectize = $select[valPorDefecto].selectize;
    selectize.setValue(valPorDefecto);
}

function restrictKeyboard(tag) {
    tag.keypress(function (event) {
        if (event.which < 48 || event.which > 57) {
            if (!(event.which == 8 || event.which == 0 || event.which == 13)) {
                event.preventDefault();
            }
        }
    });
}



/*daterange disable y enable   se pasa como parametro el id en forma de texto
EJ: "#fecha_cobro"
No pasar objeto de jquery
*/
var dateRange = {
    disable: function (tag) {
        localStorage.setItem(tag, $(tag).val());
        auxDate = $(tag).val();
        $(tag).prop('disabled', true);
        $(tag).val("");
        $(tag).parent().siblings().first().children().first().addClass("uk-text-muted");
        $(tag).parent().siblings(".uk-grid-collapse").children().each(function () {
            $(this).addClass('disabled');
            $(this).removeClass("md-btn-accent")
        });
    },
    enable: function (tag) {
        $(tag).prop('disabled', false);
        if (localStorage.getItem(tag)) {
            $(tag).val(localStorage.getItem(tag))
        };
        $(tag).val(auxDate);
        $(tag).parent().siblings().first().children().first().removeClass("uk-text-muted");
        $(tag).parent().siblings(".uk-grid-collapse").children().each(function () {
            $(this).addClass("md-btn-accent");
            $(this).removeClass('disabled')
        });
    }
}


altair_form_file_upload = {
    init: function (allow, notAllowedText) {
        var progressbar = $("#file_upload-progressbar"),
            bar = progressbar.find('.uk-progress-bar'),
            settings = {
                allow: allow, // File filter
                loadstart: function () {
                    bar.css("width", "0%").text("0%");
                    progressbar.removeClass("uk-hidden");
                },
                error: function (error) {
                    alert(error);
                },
                notallowed: function (error) {
                    swal({
                        title: "Archivo no válido",
                        text: notAllowedText,
                        icon: "warning",
                        type: "warning"
                    });
                },
                progress: function (percent) {
                    percent = Math.ceil(percent);
                    bar.css("width", percent + "%").text(percent + "%");
                },
                allcomplete: function (response, xhr) {
                    bar.css("width", "100%").text("100%");
                    bar.addClass('uk-progress-success');
                    setTimeout(function () {
                        progressbar.addClass("uk-hidden");
                    }, 250);
                    setTimeout(function () {
                        UIkit.notify({
                            message: "Carga Completa",
                            pos: 'top-right'
                        });
                    }, 280);
                    $(".archivoText strong").text($("#files").val());
                    $("#submit_file").removeClass("uk-hidden");
                    $(".uk-form-file").removeClass("md-btn-accent");
                    $(".uk-form-file").get(0).firstChild.nodeValue = "Cambiar archivo";
                }
            };

        var select = UIkit.uploadSelect($("#files"), settings);
        //drop = UIkit.uploadDrop($("#file_upload-drop"), settings);
    }
};


/**
 * @param {string} columnsWidth example:  columnsWidth = "1-3"
 */
function agregarResponsiveDatatable(columnsWidth) {
    return {
        details: {
            renderer: function (api, rowIdx, columns) {
                var data = $.map(columns, function (col, i) {
                    return col.hidden ?
                        `<div class="uk-width-small-${columnsWidth}">
                                        <strong>${col.title}</strong>  <br>  ${col.data}
                                     </div> 
                                    `:
                        '';
                }).join('');

                return data ?
                    $('<div class="uk-grid" data-uk-grid-margin/>').append(data) :
                    false;
            }
        }
    }
}


function agregarDomDatatableWithoutButtons() {
    return "<'uk-grid uk-margin-small-bottom'<'uk-width-large-1-2'l><'uk-width-large-1-2'f>>tirp"
}
/*datatable functions globals*/
function agregarDomDatatable() {
    //return "<'uk-grid'<'uk-width-large-1-1 uk-flex uk-flex-right'B>>" +
    //    "<'uk-grid uk-margin-small-bottom'<'uk-width-large-2-3'l><'uk-width-large-1-3'f>>tirp"
    return "<'uk-grid uk-margin-small-bottom'<'uk-width-large-3-10'l><'uk-width-large-3-10'f><'uk-width-large-4-10 uk-flex uk-flex-right'B>>tirp"
}

function agregarLenguajeDatatable() {
    return {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
}


function activarMenu(liActiveId) {
    if (!$("body").hasClass("sidebar_mini")) {
        if ($(liActiveId).parents('li').hasClass("submenu_trigger")) {
            $(liActiveId).addClass('act_item');
            $li = $(liActiveId).parents('li');
            if (!$li.hasClass('act_section')) {
                $li.addClass('act_section');
                $li.children("a").children(".menu_title").addClass('md-color-dark');
                $li.children("a").children(".menu_icon").children().addClass('md-color-dark');
            }
            $li.find('ul').css('display', 'block')
                .css('overflow', 'hidden')
        } else {
            $(liActiveId).children("a").children(".menu_title").addClass('md-color-dark');
            $(liActiveId).children("a").children(".menu_icon").children().addClass('md-color-dark');
        }
    } else {
        if ($(liActiveId).parents('li').hasClass("submenu_trigger")) {
            $(liActiveId).addClass('act_item');
            $li = $(liActiveId).parents('li');
            if (!$li.hasClass('act_section')) {
                $li.addClass('act_section');
                $li.children("a").children(".menu_title").addClass('md-color-dark');
                $li.children("a").children(".menu_icon").children().addClass('md-color-dark');
            }
        } else {
            $(liActiveId).children("a").children(".menu_title").addClass('md-color-dark');
            $(liActiveId).children("a").children(".menu_icon").children().addClass('md-color-dark');
        }
    }
}

function configDateRangePicker() {
    return {
        format: 'DD-MM-YYYY',
        language: 'es',
        separator: ' al ',
        monthSelect: true,
        yearSelect: true,
        getValue: function () {
            return $(this).val();
        },
    }
};
/**
 * Fixerrrr DATERANGE
toma el valor de la vista y retorna un array con las fechas 
 */
function catchValuesDateRange(tag) {
    var arrayDates;
    if (tag.val()) {
        arrayDates = tag.val().split("al");
        arrayDates[0] = arrayDates[0].trim();
        arrayDates[1] = arrayDates[1].trim();
    } else {
        arrayDates[0] = null;
        arrayDates[1] = null;
    }
    return arrayDates
}

function isNullOrEmpty(tag) {
    return ($(tag).val() === null || $(tag).val() === undefined || $(tag).val() === "")
}

function disabledBtn(tag) {
    if (!$(tag).hasClass("disabled")) {
        $(tag).addClass("disabled");
    }
}

function ableBtn(tag) {
    if ($(tag).hasClass("disabled")) {
        $(tag).removeClass("disabled");
    }
}

function addfileUpload(tag) {
    var progressbar = tag.find(".file_upload-progressbar"),
        bar = progressbar.find('.uk-progress-bar'),
        settings = {
            allow: '*.(pdf)', // File filter
            loadstart: function () {
                bar.css("width", "0%").text("0%");
                progressbar.removeClass("uk-hidden");
            },
            error: function (error) {
                alert(error);
            },
            notallowed: function (error) {
                swal({
                    title: "Archivo no válido",
                    text: "Solo se permiten archivos *.pdf",
                    icon: "warning",
                    type: "warning"
                });
            },
            progress: function (percent) {
                percent = Math.ceil(percent);
                bar.css("width", percent + "%").text(percent + "%");
            },
            allcomplete: function (response, xhr) {
                bar.css("width", "100%").text("100%");
                bar.addClass('uk-progress-success');
                setTimeout(function () {
                    progressbar.addClass("uk-hidden");
                }, 250);
                setTimeout(function () {
                    UIkit.notify({
                        message: "Carga Completa",
                        pos: 'top-right'
                    });
                }, 280);
                tag.find(".archivoText strong").text(tag.find(".files").val());
                tag.find(".submit_file").removeClass("uk-hidden");
            }
        };
    select = UIkit.uploadSelect(tag.find(".files"), settings);
}



/**
 * datatable para arreglar problmas del fixerheader
    SOLO PASA CUADNO ESTA DENTRO DE TABS COMO en Consulta De Pagos 
 */
function updateFixedHeaderDatatable(tabla) {
   
    $("#tabs_1").unbind('change.uk.tab');
    $("#tabs_1").on('change.uk.tab', function (e, active, previous) {
        if (previous.text().toLowerCase().split(" ")[0] !== "detalle" && active.text().toLowerCase().split(" ")[0] === "detalle") {
            console.log("destruyo")
            tabla.fixedHeader.disable();
        }

        if (previous.text().toLowerCase().split(" ")[0] === "detalle" && active.text().toLowerCase().split(" ")[0] !== "detalle") {
            let miPrimeraPromise = new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve();
                }, 50);
            });

            miPrimeraPromise.then((successMessage) => {
                debugger;
                tabla.fixedHeader.enable();
                tabla.fixedHeader.adjust();
            });
        }
    });
}

