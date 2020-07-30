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
