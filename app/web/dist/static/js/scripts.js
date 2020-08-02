var overlay = document.getElementById("overlay");
var max_articles_input = document.getElementById("menu__max-articles");
var keywords_input = document.getElementById("menu__keyword-search")
var container = document.getElementById("news-articles");
var menu = document.getElementById("menu");
var loader = document.getElementsByClassName("loader")[0];
var root = document.documentElement;
var computed_root = getComputedStyle(root);
var api_server = "https://marcos-newsapp.herokuapp.com";
var max_articles = max_articles_input.value;
var previous_articles;

const MAX_ARTICLES = 25;
const DEFAULT_SORT_ORDER = 0
max_articles_input.min = 1;
max_articles_input.max = MAX_ARTICLES;


// Thank you https://www.w3schools.com/howto/howto_css_overlay.asp
// Thank you https://scotch.io/tutorials/how-to-change-a-css-background-images-opacity
// Thank you https://www.w3schools.com/howto/howto_css_custom_checkbox.asp

// Thank you http://zetcode.com/gulp/getting-started/ and http://snippetvalley.com/combine-and-minify-all-css-and-javascript-with-gulp/

// https://autoprefixer.github.io/
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


function loader_on() {
    loader.style.display = "block";
}

function loader_off() {
    loader.style.display = "none";
}

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
function set_theme(color) {
    const themes = ["default",
        "darkaquamarine",
        "coolmonochrome",
        "darkred",
        "ice-cream-cone",
        "fiery-earth",
        "bee",
        "darkblue",
        "cyanblue",
        "c1blue",
        "purple"
    ];

    color = color.toLowerCase().trim();

    if (themes.includes(color)) {
        localStorage.setItem("theme", color);

        switch (color.toLowerCase().trim()) {
            // root.style.setProperty("--main-bg-color",);
            // root.style.setProperty("--alternate-bg-color",);
            // root.style.setProperty("--main-color",);
            // root.style.setProperty("--accent-color",);
            // root.style.setProperty("--overlay-background",);
            // root.style.setProperty("--menu-color",);

            case "default":
                root.style.setProperty("--main-bg-color", "#ffffff");
                root.style.setProperty("--alternate-bg-color", "#e5e5e5");
                root.style.setProperty("--main-color", "#000000");
                root.style.setProperty("--accent-color", "#fca311");
                root.style.setProperty("--overlay-background", "#ffffff");
                root.style.setProperty("--menu-color", "#14213d");
                break;

            case "darkaquamarine":
                root.style.setProperty("--main-bg-color", "#ffffff");
                root.style.setProperty("--alternate-bg-color", "#d9d9d9");
                root.style.setProperty("--main-color", "#353535");
                root.style.setProperty("--accent-color", "#284b63");
                root.style.setProperty("--overlay-background", "#ffffff");
                root.style.setProperty("--menu-color", "#3c6e71");
                break;

            case "coolmonochrome":
                root.style.setProperty("--main-bg-color", "#e0fbfc");
                root.style.setProperty("--alternate-bg-color", "#c2dfe3");
                root.style.setProperty("--main-color", "#253237");
                root.style.setProperty("--accent-color", "#5c6b73");
                root.style.setProperty("--overlay-background", "#e0fbfc");
                root.style.setProperty("--menu-color", "#9db4c0");
                break;

            case "darkred":
                root.style.setProperty("--main-bg-color", "#edddd4");
                root.style.setProperty("--alternate-bg-color", "#cfbdb2");
                root.style.setProperty("--main-color", "#283d3b");
                root.style.setProperty("--accent-color", "#c44536");
                root.style.setProperty("--overlay-background", "#edddd4");
                root.style.setProperty("--menu-color", "#772e25");
                break;

            case "ice-cream-cone":
                root.style.setProperty("--main-bg-color", "#faf9f9");
                root.style.setProperty("--alternate-bg-color", "#ffd6ba");
                root.style.setProperty("--main-color", "#555b6e");
                root.style.setProperty("--accent-color", "#89b0ae");
                root.style.setProperty("--overlay-background", "#faf9f9");
                root.style.setProperty("--menu-color", "#bee3db");
                break;

            case "fiery-earth":
                root.style.setProperty("--main-bg-color", "#fffcf2");
                root.style.setProperty("--alternate-bg-color", "#ccc5b9");
                root.style.setProperty("--main-color", "#252422");
                root.style.setProperty("--accent-color", "#eb5e28");
                root.style.setProperty("--overlay-background", "#fffcf2");
                root.style.setProperty("--menu-color", "#403d39");
                break;

            case "bee":
                root.style.setProperty("--main-bg-color", "#e8eddf");
                root.style.setProperty("--alternate-bg-color", "#cfdbd5");
                root.style.setProperty("--main-color", "#242423");
                root.style.setProperty("--accent-color", "#f5cb5c");
                root.style.setProperty("--overlay-background", "#e8eddf");
                root.style.setProperty("--menu-color", "#333533");
                break;

            case "darkblue":
                root.style.setProperty("--main-bg-color", "#e0e1dd");
                root.style.setProperty("--alternate-bg-color", "#778da9");
                root.style.setProperty("--main-color", "#0d1b2a");
                root.style.setProperty("--accent-color", "#1b263b");
                root.style.setProperty("--overlay-background", "#e0e1dd");
                root.style.setProperty("--menu-color", "#415a77");
                break;
            case "cyanblue":
                root.style.setProperty("--main-bg-color", "#caf0f8");
                root.style.setProperty("--alternate-bg-color", "#90e0ef");
                root.style.setProperty("--main-color", "#03045e");
                root.style.setProperty("--accent-color", "#00b4d8");
                root.style.setProperty("--overlay-background", "#caf0f8");
                root.style.setProperty("--menu-color", "#0077b6");
                break;
            case "c1blue":
                root.style.setProperty("--main-bg-color", "#e0fbfc");
                root.style.setProperty("--alternate-bg-color", "#98c1d9");
                root.style.setProperty("--main-color", "#293241");
                root.style.setProperty("--accent-color", "#ee6c4d");
                root.style.setProperty("--overlay-background", "#e0fbfc");
                root.style.setProperty("--menu-color", "#3d5a80");
                break;
            case "purple":
                root.style.setProperty("--main-bg-color", "#f3e9d2");
                root.style.setProperty("--alternate-bg-color", "#c9ada7");
                root.style.setProperty("--main-color", "#22223b");
                root.style.setProperty("--accent-color", "#4a4e69");
                root.style.setProperty("--overlay-background", "#f3e9d2");
                root.style.setProperty("--menu-color", "#9a8c98");

                break;

        }
    }
}
function insertCard(article) {
    // Card title
    const title_el = document.createElement("h2");
    title_el.innerText = article.title;
    title_el.classList.add("card__title");

    // Card subtitle
    const subtitle_el = document.createElement("p");
    subtitle_el.innerText = article.subtitle;
    subtitle_el.classList.add("card__subtitle");

    // Container for title and subtitle
    const div = document.createElement("div");
    div.appendChild(title_el);
    div.appendChild(document.createElement("br"));
    div.appendChild(subtitle_el);

    // Image
    const img = document.createElement("img");
    img.classList.add("card__image");
    img.setAttribute("src", article.image);
    img.setAttribute("alt", article.title);

    // Make card
    const card = document.createElement("div");
    card.classList.add("card")
    card.appendChild(img);
    card.appendChild(div);

    // Add event listener for card
    card.addEventListener("click", function (e) {

        // Hide any open dropdown menus
        close_all_dropdowns();

        // Hide menu
        hide_menu();

        // Prepare content for the article
        const x_icon = `<i id="overlay__news-article__close-button" class="fa fa-fw fa-times-circle" onclick="overlay_off()"></i>`;

        const title = `<h2 id="overlay__news-article__title">${article.title}</h2>`;
        const subtitle = `<h4 id="overlay__news-article__subtitle">${article.subtitle}</h4>`;
        const image = `<img id="overlay__news-article__image" src='${article.image}' alt='${article.title}'/>`
        const date = `<br><br><h6 id="overlay__news-article__date">${article.last_edited}</h6><hr>`;
        const header = title + subtitle + image + date;

        const link_end = `<br><br><hr>Leer articulo original <a href="${article.url}">aqui</a>`;

        // Compose content
        overlay.children[0].innerHTML = x_icon + header + article.article.replace(/\n/g, "<br>") + link_end;

        overlay_on();
    });

    // Blur animation to introduce new cards
    card.animate([
        { opacity: 0 },
        { opacity: 1 }
    ], {
        duration: 300,
        iterations: 1
    });

    card.classList.add(article.paper + "__watermark");

    container.appendChild(card);
}

function add_articles(articles) {
    // Compile all articles into a monolithic array
    articles_arr = Object.values(articles).flat();

    // Find out what is the sort criteria
    let sort_order = DEFAULT_SORT_ORDER;

    switch (localStorage.getItem("selected_order")) {
        case "inverse_chronological_order":
            sort_order = 0;
            break;
        case "chronological_order":
            sort_order = 1;
            break;
        case "long-ascending":
            sort_order = 2;
            break;
        case "long-descending":
            sort_order = 3;
            break;
        default:
            break;
    }

    // Sort articles by sort criteria
    const comparison_functions = [
        // Newest to oldest
        function (a, b) {
            const d1 = new Date(a.last_edited.replace(/ \|/g, ""));
            const d2 = new Date(b.last_edited.replace(/ \|/g, ""));

            return d2 - d1;
        },
        // Oldest to newest
        function (a, b) {
            const d1 = new Date(a.last_edited.replace(/ \|/g, ""));
            const d2 = new Date(b.last_edited.replace(/ \|/g, ""));

            return d1 - d2;
        },
        // Shortest to longest
        function (a, b) {
            const l1 = a.article.length;
            const l2 = b.article.length;

            return l1 - l2;
        },
        // Longest to shortest
        function (a, b) {
            const l1 = a.article.length;
            const l2 = b.article.length;

            return l2 - l1;
        }
    ];

    articles_arr.sort(comparison_functions[sort_order]);


    // Extract list of keywords by which to filter the articles through
    let keywords = keywords_input.value.toLowerCase().trim();

    if (keywords.includes(",")) {
        keywords = keywords.split(",");
    } else {
        keywords = [keywords];
    }

    for (let i = 0, l0 = articles_arr.length; i < l0; i++) {
        // Search for keywords
        for (const keyword of keywords) {
            const article = articles_arr[i];
            const text = (article.title + article.subtitle + article.article).toLowerCase();
            if (keyword === "" || text.includes(keyword)) {
                insertCard(article);
            }
        }
    }

}

function update_screen(requestAgain = true) {
    container.innerHTML = "";

    // Prepare which news papers to filter for
    let papers = JSON.parse(localStorage.getItem("selected_newspapers"));

    // Retrieve newspaper from backend
    if (requestAgain) {
        loader_on();
        axios.get(`${api_server}/api/v1/services/news_scraping?papers=${papers.join(",")}&max_articles=${max_articles}`)
            .then(function (articles) {
                previous_articles = articles;
                loader_off();
                add_articles(articles);
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        add_articles(previous_articles);
    }
}


window.addEventListener("load", function (e) {
    update_screen();
    if (typeof (localStorage.getItem("theme")) === "string") {
        set_theme(localStorage.getItem("theme"));
    } else {
        set_theme("default");
    }

    restore_preferences();
    store_preferences();
});