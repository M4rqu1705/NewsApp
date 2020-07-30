function update_max_articles() {
    MAX_ARTICLES = max_articles_input.value;
    if (MAX_ARTICLES === '' || MAX_ARTICLES > 50) {
        MAX_ARTICLES = 2;
    }
}

function add_articles(articles) {
    let keywords = keywords_input.value.toLowerCase().trim();

    if (keywords.includes(",")) {
        keywords = keywords.split(",");
    }

    const keys = Object.keys(articles);
    const l0 = keys.length;
    for (let i = 0; i < l0; i++) {

        const key = keys[i];
        const l1 = articles[key].length;
        for (let j = 0; j < l1; j++) {

            const article = articles[key][j];

            // Search for keywords
            text = (article.title + article.subtitle + article.article).toLowerCase();

            if (keywords === "") {
                insertCard(article, paper = keys[i]);
            } else if (typeof keywords === "string" && keywords !== "") {
                // Check if the keyword (the string) is in freq
                if (text.includes(keywords)) {
                    insertCard(article, paper = keys[i]);
                }
            } else if (typeof keywords === "object" && keywords !== "") {
                // Check if any of the keywords is in freq
                for (let j = 0, l1 = keywords.length; j < l1; j++) {
                    if (text.includes(keywords[j])) {
                        insertCard(article, paper = keys[i]);
                        break;
                    }
                }
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
        if (temp[i].tagName === "INPUT" && temp[i].checked) {
            papers.push(temp[i].value);
        }
    }

    // Retrieve newspaper from backend
    if (requestAgain) {
        axios.get(`${api_server}/api/v1/services/news_scraping?papers=${papers.join(",")}&max_articles=${MAX_ARTICLES}`)
            .then(function (articles) {
                console.log(articles)
                previous_content = articles;
                add_articles(articles);
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        add_articles(previous_content);
    }
}

function insertCard(article, paper) {

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
        menu_off();

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

        // console.log(article.article);
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

    card.classList.add(paper);

    container.appendChild(card);
}

window.addEventListener("load", function (e) {
    update_screen();
    if (typeof (localStorage.getItem("theme")) === "string") {
        set_theme(localStorage.getItem("theme"));
    } else {
        set_theme("default");
    }
});