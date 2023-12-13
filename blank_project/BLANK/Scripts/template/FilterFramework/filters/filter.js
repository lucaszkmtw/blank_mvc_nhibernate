
class Filter {
    constructor(jquery_combo) {
        this._combo = jquery_combo;
        try {
            this._id = this._combo[0].id;
        } catch (e) {
            console.error(`Error en la instanciacion del filtro...¿Existe el combo en el DOM del html?¿Se corresponde con un objeto de JQUERY ? `);
        }

        this._label = this._combo.closest('[class^="uk-width"]').find('label').html();
        this._self = this;
        this._value = this._combo.val();
        this._text = this._label;
        this._html = "";
    }

    get combo() {
        return this._combo;
    }

    get id() {
        return this._id;
    }

    get label() {
        return this._label;
    }

    get text() {
        return this._text;
    }

    get value() {
        return this._value;
    }

    set value(newVal) {
        this._value = newVal;
    }

    set text(newText) {
        this._text = newText;
    }

    get html() {
        return this._html;
    }

    set html(htmlText) {
        this._html = htmlText;
    }

    addFilterList(aList) {
        this._totalList = aList;
    }

    removeHtml() {
        this._html = "";
    }

    printConsole() {
        console.log(this._combo)
    }


    addToFather() {
        if (this._self._totalList != undefined && this._self._totalList != null) {
            if (this.value) {
                this._html = `<span class="uk-badge md-bg-primary uk-badge-notification filter filter-${this.id}"><b>${this.label.toUpperCase()} : &nbsp</b> ${this.text}</span>`;
                this._totalList.addFilter(this);
            } else {
                this.removeHtml();
                this._totalList.deleteFilter(this);
            }
        }
    }
}
