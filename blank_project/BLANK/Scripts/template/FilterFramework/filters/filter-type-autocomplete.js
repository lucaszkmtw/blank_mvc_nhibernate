

class FilterTypeAutocomplete extends Filter {
    constructor(jquery_combo, url, successResponseFunc) {
        super(jquery_combo);
        this._url = url;
        //this._vItem = vItem;
        this._successResponseFunc = successResponseFunc;
        this.aplicarAutocomplete();
        this.applyEvent();
    }

    applyEvent() {
        let self = this;
        this._combo.unbind("selectitem.uk.autocomplete");
        this._combo.on('selectitem.uk.autocomplete', function (event, data) {
            /*change dom values*/
            self.setValue(data.id, data.value);
        });
    }

    change(func = "null") {
        if (func) {
            this._change = func;
        }
    }

    /**
     * /
     * @param {any} id   -> lo que viaja por el request
     * @param {any} descript -> lo que se muestra en el combo
     */
    setValue(id, descript) {
        this.value = id;
        this.text = descript;
        this.addToFather();
        if (this._change != null && this._change != undefined) {
            this._change();
        }
    }

    clear() {
        this.combo.find("input").val("");
        this.setValue("", "");
    }

    aplicarAutocomplete() {
        let self = this;
        $.UIkit.autocomplete(self._combo, {
            source: function (response) {
                $.ajax({
                    url: self._url,
                    data: { query: this.value },
                    dataType: 'json',
                    type: 'POST',
                    success: function (data) {
                        response($.map(data, self._successResponseFunc));
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            },
            minLength: 3,
        });
    }
}
