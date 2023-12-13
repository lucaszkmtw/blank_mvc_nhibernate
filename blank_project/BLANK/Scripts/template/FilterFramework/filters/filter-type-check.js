

class FilterTypeCheck extends Filter {
    constructor(jquery_combo) {
        super(jquery_combo);
        this.init();
        this.applyEvent();
        this.value = false;
    }

    init() {
        altair_md.checkbox_radio(this.combo);
    }

    applyEvent() {
        let self = this._self;
        this.combo.unbind("ifChanged");
        this.combo.on('ifChanged', function (event) {
            self.value = event.target.checked;
            self.text = self.value.toString();
            self.addToFather();
            if (self._change != null && self._change != undefined) {
                self._change();
            }
        });
    }

    change(func = "null") {
        if (func) {
            this._change = func;
        }
    }

    uncheck() {
        this.combo.iCheck("uncheck")
    }

    check() {
        this.combo.iCheck("check")
    }

}