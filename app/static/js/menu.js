function menu_on() {
    menu.style.width = getComputedStyle(root).getPropertyValue("--navbar-width");
    document.getElementById("navbar__open-button").style.color = getComputedStyle(root).getPropertyValue("--main-bg-color");
}

function menu_off() {
    menu.style.width = 0;
    document.getElementById("navbar__open-button").style.color = getComputedStyle(root).getPropertyValue("--main-color");
    // menu.style.padding = 0;
}

function toggle_menu() {
    if (menu.style.width.length > 3) {
        menu_off();
    } else {
        menu_on();
    }
}