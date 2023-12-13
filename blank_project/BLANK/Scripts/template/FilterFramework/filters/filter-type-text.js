

class FilterTypeText extends Filter {
    constructor(jquery_combo) {
        super(jquery_combo);
        this.applyEvent();
    }

    applyEvent() {
        let self = this._self;
        this.combo.unbind("keyup");
        this.combo.keyup(function () {
            self.value = $(this).val();
            self.text = $(this).val();
            self.addToFather();
        })
    }
}
