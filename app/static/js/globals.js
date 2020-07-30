var overlay = document.getElementById("overlay");
var max_articles_input = document.getElementById("navbar__max-articles");
var keywords_input = document.getElementById("navbar__keyword-search")
var container = document.getElementById("news-articles");
var menu = document.getElementById("navbar");
var root = document.documentElement;
// var api_server = "https://marcos-newsapp.herokuapp.com";
var api_server = "http://127.0.0.1:5000";
var MAX_ARTICLES = max_articles_input.value;
var previous_content;


// Thank you https://www.w3schools.com/howto/howto_css_overlay.asp
// Thank you https://scotch.io/tutorials/how-to-change-a-css-background-images-opacity

// https://autoprefixer.github.io/