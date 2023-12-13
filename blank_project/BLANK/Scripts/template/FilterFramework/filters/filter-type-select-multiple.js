

class FilterTypeMultiSelect extends FilterTypeSelect {
    constructor(jquery_combo) {
        super(jquery_combo);
    }

    applyEvent() {
        let self = this._self;
        this._combo.unbind("change");
        this._combo.change(function () {
            self.value = $(this).val();
            if (self.value !== undefined && self.value !== null) {
                self.text = self.completeMultipleText($(this).val());
            }
            self.addToFather();
            if (self._change !== null && self._change !== undefined) {
                self._change();
            }
        })
    }

    completeMultipleText(arrayValues) {
        let string = "";
        let self = this._self;
        for (let [index, value] of arrayValues.entries()) {
            string += $(self.selectizeControl.getItem(value)[0]).text();
            if (arrayValues.length - 1 != index) {
                string += "&nbsp | &nbsp";
            }
        }
        return string;
    }

    selectAll() {
        let self = this;
        var optKeys = Object.keys(self._selectizeControl.options);
        optKeys.forEach(function (key, index) {
            self._selectizeControl.addItem(key);
        });
    }

    deselectAll() {
        this._selectizeControl.clear();
    }

    aplicarSelectize(tag) {
        return tag.selectize({
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
}
