function show_menu() {
    menu.style.width = computed_root.getPropertyValue("--menu-width");
    document.getElementById("menu__open-button").style.color = computed_root.getPropertyValue("--main-bg-color");
    document.body.style.overflowY = "hidden";
}

function hide_menu() {
    menu.style.width = 0;
    document.getElementById("menu__open-button").style.color = computed_root.getPropertyValue("--main-color");
    document.body.style.overflowY = "scroll";
    close_all_dropdowns();
}

function toggle_menu() {
    if (menu.style.width.length > 3) {
        hide_menu();
    } else {
        show_menu();
    }
}

// COLORS DROPDOWNS

function show_colors_dropdown() {
    close_all_dropdowns();
    const el = document.getElementById("menu__color-dropdown__dropdown-content");
    el.classList.add('show-colors');
}
function hide_colors_dropdown() {
    const el = document.getElementById("menu__color-dropdown__dropdown-content");
    el.classList.remove('show-colors');
}
function toggle_colors_dropdown() {
    const el = document.getElementById("menu__color-dropdown__dropdown-content");
    if (el.classList.contains('show-colors')) {
        hide_colors_dropdown();
    } else {
        show_colors_dropdown();
    }
}

// NEWSPAPERS DROPDOWN

function show_newspaper_filter_dropdown() {
    close_all_dropdowns();
    const el = document.getElementById("menu__papers-filter-dropdown__dropdown-content");
    el.classList.add('show-papers');
}

function hide_newspaper_filter_dropdown() {
    const el = document.getElementById("menu__papers-filter-dropdown__dropdown-content");
    el.classList.remove('show-papers');
}

function toggle_newspaper_filter_dropdown() {
    const el = document.getElementById("menu__papers-filter-dropdown__dropdown-content");
    if (el.classList.contains('show-papers')) {
        hide_newspaper_filter_dropdown();
    } else {
        show_newspaper_filter_dropdown();
    }
}

// SORTERS DROPDOWN
function show_sorters_dropdown() {
    close_all_dropdowns();
    const el = document.getElementById("menu__sorters-dropdown__dropdown-content");
    el.classList.add('show-sorters');
}

function hide_sorters_dropdown() {
    const el = document.getElementById("menu__sorters-dropdown__dropdown-content");
    el.classList.remove('show-sorters');
}

function toggle_sorters_dropdown() {
    const el = document.getElementById("menu__sorters-dropdown__dropdown-content");
    if (el.classList.contains('show-sorters')) {
        hide_sorters_dropdown();
    } else {
        show_sorters_dropdown();
    }
}


function close_all_dropdowns() {
    hide_colors_dropdown();
    hide_newspaper_filter_dropdown();
    hide_sorters_dropdown()
}