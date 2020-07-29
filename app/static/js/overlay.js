function overlay_on() {
    overlay.style.display = "flex";
    overlay.children[0].scrollTop = 0;
    document.body.style.overflow = "hidden";
}

function overlay_off() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
}

function overlay_toggle() {
    if (overlay.style.display === "flex") {
        overlay_off();
    } else {
        overlay_on();
    }
}
