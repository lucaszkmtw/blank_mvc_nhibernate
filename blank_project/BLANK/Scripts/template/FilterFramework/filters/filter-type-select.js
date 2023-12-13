
class FilterTypeSelect extends Filter {
    constructor(jquery_combo) {
        super(jquery_combo);
        this.init();
        this.applyEvent();
    }

    init() {
        this._selectizeControl = this.aplicarSelectize(this.combo)[0].selectize;
    }

    selectValue(newVal) {
        this._selectizeControl.setValue(newVal);
    }

    change(func = "null") {
        if (func) {
            this._change = func;
        }
    }

    applyEvent() {
        let self = this._self;
        this.combo.unbind("change");
        this.combo.change(function () {
            self.value = $(this).val();
            if (self.value != undefined && self.value != null) {
                self.text = $(this).text();
            }
            self.addToFather();
            if (self._change != null && self._change != undefined) {
                self._change();
            }
        })
    }

    get selectizeControl() {
        return this._selectizeControl;
    }

    aplicarSelectize(tag) {
        return tag.selectize({
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

        });
    }

}