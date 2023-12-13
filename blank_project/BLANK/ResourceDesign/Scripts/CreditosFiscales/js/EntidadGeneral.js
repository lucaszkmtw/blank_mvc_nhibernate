function chequearContenidoVacios() {

    var selector = document.querySelectorAll('td')

    for (var i = 0; i < selector.length; i++) {
        if (selector[i].textContent == '') selector[i].textContent = '-';
    }
}