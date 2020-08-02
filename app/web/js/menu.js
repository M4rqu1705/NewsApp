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


// Remember last options for desired articles and desired newspapers and extract label tags
function store_preferences() {
    // Extract value of checked newspapers
    const selected_newspapers = [...document.getElementById(
        "menu__papers-filter-dropdown__dropdown-content"
    ).children]
        .filter(el => el.tagName === "LABEL")
        .filter(el => el.children[0].checked)
        .map(el => el.children[0].value);

    const selected_order = [...document.getElementById(
        "menu__sorters-dropdown__dropdown-content"
    ).children]
        .filter(el => el.tagName === "LABEL")
        .filter(el => el.children[0].checked)
        .map(el => el.children[0].id.split("__").slice(-1)[0])[0];

    const amount_articles = document.getElementById("menu__max-articles").value;

    localStorage.setItem("selected_newspapers", JSON.stringify(selected_newspapers));
    localStorage.setItem("selected_order", selected_order);
    localStorage.setItem("amount_articles", String(amount_articles));


}

function restore_preferences() {
    if (localStorage.getItem("selected_newspapers") !== null) {
        const selected_newspapers = JSON.parse(localStorage.getItem("selected_newspapers"));

        const newspaper_dropdown = [...document.getElementById(
            "menu__papers-filter-dropdown__dropdown-content"
        ).children]
            .filter(el => el.tagName === "LABEL")

        for (let i = 0, l0 = newspaper_dropdown.length; i < l0; i++) {
            if (selected_newspapers.includes(newspaper_dropdown[i].children[0].value)) {
                newspaper_dropdown[i].children[0].checked = true;
            } else {
                newspaper_dropdown[i].children[0].checked = false;
            }
        }
    }

    if (localStorage.getItem("selected_order") !== null) {
        const selected_order = localStorage.getItem("selected_order");

        const sorter_dropdown = [...document.getElementById(
            "menu__sorters-dropdown__dropdown-content"
        ).children]
            .filter(el => el.tagName === "LABEL");

        for (let i = 0, l0 = sorter_dropdown.length; i < l0; i++) {
            if (sorter_dropdown[i].children[0].id.split("__").slice(-1)[0] === selected_order) {
                sorter_dropdown[i].children[0].checked = true;
                break;
            }
        }

    }

    if (localStorage.getItem("amount_articles") !== null) {
        const amount_articles = localStorage.getItem("amount_articles");
        max_articles_input.value = Number(amount_articles);
    }

}


function update_max_articles() {
    max_articles = max_articles_input.value;

    // If restrictions are not met, use default value
    if (max_articles === '') {
        max_articles = 4;
    } else if (typeof max_articles === "number" && max_articles <= 0) {
        max_articles = 1;
    } else if (typeof max_articles === "number" && max_articles > MAX_ARTICLES) {
        max_articles = MAX_ARTICLES;
    }

    store_preferences();
}