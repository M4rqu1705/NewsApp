function dropdown_on(el) {
    el.nextElementSibling.classList.add('show-papers');
}

function dropdown_off(el) {
    el.nextElementSibling.classList.remove('show-papers');
}

function dropdown_toggle(el) {
    if (el.nextElementSibling.classList.contains('show-papers')) {
        dropdown_off(el);
    } else {
        dropdown_on(el);
    }
}

function color_down(el) {
    el.nextElementSibling.classList.add('show-colors');
}
function color_up(el) {
    el.nextElementSibling.classList.remove('show-colors');
}
function color_toggle(el) {
    if (el.nextElementSibling.classList.contains('show-colors')) {
        color_up(el);
    } else {
        color_down(el);
    }
}


function close_all_dropdowns() {
    const temp = document.getElementsByClassName('dropdown-content');
    const l0 = temp.length;
    for (let i = 0; i < l0; i++) {
        if (temp[i].classList.contains("show-papers")) {
            temp[i].classList.remove("show-papers");
        }
        else if (temp[i].classList.contains("show-colors")) {
            temp[i].classList.remove("show-colors");
        }
    }
}