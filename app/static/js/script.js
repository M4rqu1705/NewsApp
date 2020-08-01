function update_max_articles() {
    max_articles = max_articles_input.value;

    // If restrictions are not met, use default value
    if (max_articles === '') {
        max_articles = 2;
    } else if (typeof max_articles === "number" && max_articles <= 0) {
        max_articles = 1;
    } else if (typeof max_articles === "number" && max_articles > MAX_ARTICLES) {
        max_articles = MAX_ARTICLES;
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
    const temp = document.getElementById("menu__sorters-dropdown__dropdown-content").children;
    for (let i = 0, l0 = temp.length; i < l0; i++) {
        if (temp[i].tagName === "LABEL" && temp[i].children[0].checked) {

            // Check last "segment" of id to determine sort order
            switch (temp[i].children[0].id.split("__").slice(-1)[0]) {
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
            break;
        }
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
    console.log(articles_arr);


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
    let papers = [];

    const temp = document.getElementById("menu__papers-filter-dropdown__dropdown-content").children;
    for (let i = 0, l0 = temp.length; i < l0; i++) {
        if (temp[i].tagName === "LABEL" && temp[i].children[0].checked) {
            papers.push(temp[i].children[0].value);
        }
    }

    // Retrieve newspaper from backend
    if (requestAgain) {
        axios.get(`${api_server}/api/v1/services/news_scraping?papers=${papers.join(",")}&max_articles=${max_articles}`)
            .then(function (articles) {
                previous_articles = articles;
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
});