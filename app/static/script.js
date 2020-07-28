// Thank you https://www.w3schools.com/howto/howto_css_overlay.asp
// Thank you https://scotch.io/tutorials/how-to-change-a-css-background-images-opacity


var api_server = "https://marcos-newsapp.herokuapp.com";
var MAX_ARTICLES = 5;
var overlay = document.getElementById("overlay");
var max_articles_input = document.getElementById("max_articles");
var container = document.getElementById("container");

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

function update_max_articles() {
    MAX_ARTICLES = max_articles_input.value;
    update_screen();
}

function update_screen() {
    container.innerHTML = "";

    axios.get(`${api_server}/api/v1/services/news_scraping?papers=endi,vocero&max_articles=${MAX_ARTICLES}`)
        .then(function (articles) {
            console.log(articles)

            const keys = Object.keys(articles);
            const l0 = keys.length;
            for (let i = 0; i < l0; i++) {

                const key = keys[i];
                const l1 = articles[key].length;
                for (let j = 0; j < l1; j++) {

                    const article = articles[key][j];
                    insertCard(article, paper = keys[i]);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
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
        overlay_on();
        const link_end = `<hr>Leer articulo original <a href="${article.url}">aqui</a>`;

        const header = `<h2 class="overlay_title">${article.title}</h2>
        <h4 class="overlay_subtitle">${article.subtitle}</h4>
        <img class='overlay_image' src='${article.image}' alt='${article.title}'/>
        <h6 class='overlay_date'>${article.last_edited}</h6><hr>`;

        overlay.children[0].innerHTML = header + article.article.replace(/\n\n/g, "<br><br>") + link_end;
    });

    card.animate([
        { opacity: 0 },
        { opacity: 1 }
    ], {
        duration: 300,
        iterations: 1
    });

    if (paper === "endi") {
        card.classList.add("endi");
    } else if (paper == "vocero") {
        card.classList.add("vocero");
    }

    container.appendChild(card)
}

document.addEventListener("readystatechange", function (e) {
    update_screen();
});