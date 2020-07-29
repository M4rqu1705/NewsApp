// Thank you https://www.w3schools.com/howto/howto_css_overlay.asp
// Thank you https://scotch.io/tutorials/how-to-change-a-css-background-images-opacity


var overlay = document.getElementById("overlay");
var max_articles_input = document.getElementById("max_articles");
var keywords_input = document.getElementById("keyword_search")
var container = document.getElementById("container");
// var api_server = "https://marcos-newsapp.herokuapp.com";
var api_server = "http://127.0.0.1:5000";
var MAX_ARTICLES = max_articles_input.value;
var previous_content;

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

function dropdown_on(el) {
    el.nextElementSibling.classList.add('show');
}
function dropdown_off(el) {
    el.nextElementSibling.classList.remove('show');
    update_screen();
}
function dropdown_toggle(el) {
    if (el.nextElementSibling.classList.contains('show')) {
        dropdown_off(el);
    } else {
        dropdown_on(el);
    }
}

function frequency(string) {
    words = string.split(" ");

    freq = {}

    for (let i = 0, l0 = words.length; i < l0; i++) {
        if (freq[words[i]] !== undefined) {
            freq[words[i]]++;
        } else {
            freq[words[i]] = 1;
        }
    }

    return freq;
}

function update_max_articles() {
    MAX_ARTICLES = max_articles_input.value;
    if (MAX_ARTICLES !== '' && MAX_ARTICLES < 50) {
        update_screen();
    }
}

function update_screen(requestAgain = true) {
    container.innerHTML = "";

    // Prepare which news papers to filter for
    let papers = [];

    const temp = document.getElementById("papersFilterDropdown").children;
    for (let i = 0, l0 = temp.length; i < l0; i++) {
        if (temp[i].tagName === "INPUT" && temp[i].checked) {
            papers.push(temp[i].value);
        }
    }

    function add_articles(articles) {
        let keywords = keywords_input.value.trim();

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

    // Retrieve newspaper from backend
    if (requestAgain) {
        axios.get(`${api_server}/api/v1/services/news_scraping?papers=${papers.join(",")}&max_articles=${MAX_ARTICLES}`)
            .then(function (articles) {
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

    const title_el = document.createElement("h2");
    title_el.innerText = article.title;
    title_el.setAttribute("class", "title");

    const subtitle_el = document.createElement("p");
    subtitle_el.innerText = article.subtitle;
    subtitle_el.setAttribute("class", "subtitle");

    const div = document.createElement("div");
    div.appendChild(title_el);
    div.appendChild(subtitle_el);

    const img = document.createElement("img");
    img.setAttribute("src", article.image);
    img.setAttribute("alt", article.title);

    const card = document.createElement("a");
    card.setAttribute("class", "card");
    // card.setAttribute("href", article.url);
    card.appendChild(img);
    card.appendChild(div);

    card.addEventListener("click", function (e) {
        // Hide any open dropdown menus
        const temp = document.getElementsByClassName('dropdown-content');
        const l0 = temp.length;
        for (let i = 0; i < l0; i++) {
            if (temp[i].classList.contains("show")) {
                temp[i].classList.remove("show");
            }
        }

        // Prepare content for the article
        const x_icon = `<i class="fa fa-fw fa-times-circle overlay_close" onclick="overlay_off()"></i>`;

        const title = `<h2 class="overlay_title">${article.title}</h2>`;
        const subtitle = `<h4 class="overlay_subtitle">${article.subtitle}</h4>`;
        const image = `<img class='overlay_image' src='${article.image}' alt='${article.title}'/>`
        const date = `<h6 class='overlay_date'>${article.last_edited}</h6><hr>`;
        const header = title + subtitle + image + date;

        const link_end = `<hr>Leer articulo original <a href="${article.url}">aqui</a>`;

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

    container.appendChild(card)
}

document.addEventListener("readystatechange", function (e) {
    update_screen();
});