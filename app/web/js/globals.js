var overlay = document.getElementById("overlay");
var max_articles_input = document.getElementById("menu__max-articles");
var keywords_input = document.getElementById("menu__keyword-search")
var container = document.getElementById("news-articles");
var menu = document.getElementById("menu");
var loader = document.getElementsByClassName("loader")[0];
var root = document.documentElement;
var computed_root = getComputedStyle(root);
var api_server = "http://127.0.0.1:5000";
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