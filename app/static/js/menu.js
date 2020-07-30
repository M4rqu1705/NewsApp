function menu_on() {
    menu.style.width = getComputedStyle(root).getPropertyValue("--menu-width");
    document.getElementById("menu__open-button").style.color = getComputedStyle(root).getPropertyValue("--main-bg-color");
}

function menu_off() {
    menu.style.width = 0;
    document.getElementById("menu__open-button").style.color = getComputedStyle(root).getPropertyValue("--main-color");
    close_all_dropdowns();
}

function toggle_menu() {
    if (menu.style.width.length > 3) {
        menu_off();
    } else {
        menu_on();
    }
}