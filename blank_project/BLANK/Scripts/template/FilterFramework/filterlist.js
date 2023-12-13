class FilterList {
    /**
     * constructor
     * @param {$("#multipleFilters")} jquery_combo
     */
    constructor(jquery_combo = null, fullList = false) {
        if (jquery_combo)
            this._combo = jquery_combo;
        this.filters = [];
        this.fullList = fullList;
    }

    clear() {
        this._combo.selectize({})[0].selectize.clear();
        this.filters = new Array();
    }

    addFilter(filterclass) {
        try {
            if (!filterList.filters.includes(filterclass)) {
                this.filters.push(filterclass);
            }
            if (this._combo)
                this._combo.html(this.compileHtml())
        } catch (e) {
            console.log(e.message)
        }
    }

    deleteFilter(filterclass) {
        let index = this.filters.indexOf(filterclass);
        if (index > -1) {
            this.filters.splice(index, 1);
        }
        filterclass = null;
        if (this._combo)
            this._combo.html(this.compileHtml())
    }

    addMultipleFilters(...filters) {
        debugger;
        if (this.fullList) {
            for (let filter of filters) {
                if (this.isAFilter(filter))
                    this.addFilter(filter);
                else {
                    console.error("Hay un error en la carga de filtros.. \n Se estan pasando objetos que no heredan de filter")
                }
            }
        } else {
            for (let filter of filters) {
                if (this.isAFilter(filter))
                    filter.addFilterList(this);
                else {
                    console.error("Hay un error en la carga de filtros.. \n Se estan pasando objetos que no heredan de filter")
                }
            }
        }
    }

    isAFilter(filter) {
        return filter instanceof Filter
    }

    printConsole() {
        console.log(this.filters)
    }

    compileHtml() {
        if ((!this._combo.parent().hasClass("uk-margin-bottom")) && this.filters.length > 0)
            this._combo.parent().addClass("uk-margin-bottom")
        let html = "";
        html += "<p>";
        if (this.filters.length > 0) {
            for (let [index, value] of this.filters.entries()) {
                html += value.html;
            }
        }
        html += "</p>";
        return html;
    }

    toJson() {
        //let newjsonObj = new Object();
        let newjsonValues = new Object();
        for (let filter of this.filters) {
            //newjsonObj[filter.id] = filter;
            newjsonValues[filter.id] = filter.value;
        }
        //let obj = new Object();
        //obj["filters"] = newjsonObj;
        //obj["values"] = newjsonValues;
        //return obj;
        return newjsonValues
    }
}
