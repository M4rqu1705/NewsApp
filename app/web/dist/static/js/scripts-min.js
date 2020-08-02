var previous_articles,overlay=document.getElementById("overlay"),max_articles_input=document.getElementById("menu__max-articles"),keywords_input=document.getElementById("menu__keyword-search"),container=document.getElementById("news-articles"),menu=document.getElementById("menu"),loader=document.getElementsByClassName("loader")[0],root=document.documentElement,computed_root=getComputedStyle(root),api_server="https://marcos-newsapp.herokuapp.com",max_articles=max_articles_input.value;const MAX_ARTICLES=25,DEFAULT_SORT_ORDER=0;function overlay_on(){overlay.style.display="flex",overlay.children[0].scrollTop=0,document.body.style.overflow="hidden"}function overlay_off(){overlay.style.display="none",document.body.style.overflow=""}function overlay_toggle(){"flex"===overlay.style.display?overlay_off():overlay_on()}function loader_on(){loader.style.display="block"}function loader_off(){loader.style.display="none"}function show_menu(){menu.style.width=computed_root.getPropertyValue("--menu-width"),document.getElementById("menu__open-button").style.color=computed_root.getPropertyValue("--main-bg-color"),document.body.style.overflowY="hidden"}function hide_menu(){menu.style.width=0,document.getElementById("menu__open-button").style.color=computed_root.getPropertyValue("--main-color"),document.body.style.overflowY="scroll",close_all_dropdowns()}function toggle_menu(){menu.style.width.length>3?hide_menu():show_menu()}function show_colors_dropdown(){close_all_dropdowns(),document.getElementById("menu__color-dropdown__dropdown-content").classList.add("show-colors")}function hide_colors_dropdown(){document.getElementById("menu__color-dropdown__dropdown-content").classList.remove("show-colors")}function toggle_colors_dropdown(){document.getElementById("menu__color-dropdown__dropdown-content").classList.contains("show-colors")?hide_colors_dropdown():show_colors_dropdown()}function show_newspaper_filter_dropdown(){close_all_dropdowns(),document.getElementById("menu__papers-filter-dropdown__dropdown-content").classList.add("show-papers")}function hide_newspaper_filter_dropdown(){document.getElementById("menu__papers-filter-dropdown__dropdown-content").classList.remove("show-papers")}function toggle_newspaper_filter_dropdown(){document.getElementById("menu__papers-filter-dropdown__dropdown-content").classList.contains("show-papers")?hide_newspaper_filter_dropdown():show_newspaper_filter_dropdown()}function show_sorters_dropdown(){close_all_dropdowns(),document.getElementById("menu__sorters-dropdown__dropdown-content").classList.add("show-sorters")}function hide_sorters_dropdown(){document.getElementById("menu__sorters-dropdown__dropdown-content").classList.remove("show-sorters")}function toggle_sorters_dropdown(){document.getElementById("menu__sorters-dropdown__dropdown-content").classList.contains("show-sorters")?hide_sorters_dropdown():show_sorters_dropdown()}function close_all_dropdowns(){hide_colors_dropdown(),hide_newspaper_filter_dropdown(),hide_sorters_dropdown()}function store_preferences(){const e=[...document.getElementById("menu__papers-filter-dropdown__dropdown-content").children].filter(e=>"LABEL"===e.tagName).filter(e=>e.children[0].checked).map(e=>e.children[0].value),t=[...document.getElementById("menu__sorters-dropdown__dropdown-content").children].filter(e=>"LABEL"===e.tagName).filter(e=>e.children[0].checked).map(e=>e.children[0].id.split("__").slice(-1)[0])[0],o=document.getElementById("menu__max-articles").value;localStorage.setItem("selected_newspapers",JSON.stringify(e)),localStorage.setItem("selected_order",t),localStorage.setItem("amount_articles",String(o))}function restore_preferences(){if(null!==localStorage.getItem("selected_newspapers")){const e=JSON.parse(localStorage.getItem("selected_newspapers")),t=[...document.getElementById("menu__papers-filter-dropdown__dropdown-content").children].filter(e=>"LABEL"===e.tagName);for(let o=0,r=t.length;o<r;o++)e.includes(t[o].children[0].value)?t[o].children[0].checked=!0:t[o].children[0].checked=!1}if(null!==localStorage.getItem("selected_order")){const e=localStorage.getItem("selected_order"),t=[...document.getElementById("menu__sorters-dropdown__dropdown-content").children].filter(e=>"LABEL"===e.tagName);for(let o=0,r=t.length;o<r;o++)if(t[o].children[0].id.split("__").slice(-1)[0]===e){t[o].children[0].checked=!0;break}}if(null!==localStorage.getItem("amount_articles")){const e=localStorage.getItem("amount_articles");max_articles_input.value=Number(e)}}function update_max_articles(){""===(max_articles=max_articles_input.value)?max_articles=4:"number"==typeof max_articles&&max_articles<=0?max_articles=1:"number"==typeof max_articles&&max_articles>MAX_ARTICLES&&(max_articles=MAX_ARTICLES),store_preferences()}function set_theme(e){if(e=e.toLowerCase().trim(),["default","darkaquamarine","coolmonochrome","darkred","ice-cream-cone","fiery-earth","bee","darkblue","cyanblue","c1blue","purple"].includes(e))switch(localStorage.setItem("theme",e),e.toLowerCase().trim()){case"default":root.style.setProperty("--main-bg-color","#ffffff"),root.style.setProperty("--alternate-bg-color","#e5e5e5"),root.style.setProperty("--main-color","#000000"),root.style.setProperty("--accent-color","#fca311"),root.style.setProperty("--overlay-background","#ffffff"),root.style.setProperty("--menu-color","#14213d");break;case"darkaquamarine":root.style.setProperty("--main-bg-color","#ffffff"),root.style.setProperty("--alternate-bg-color","#d9d9d9"),root.style.setProperty("--main-color","#353535"),root.style.setProperty("--accent-color","#284b63"),root.style.setProperty("--overlay-background","#ffffff"),root.style.setProperty("--menu-color","#3c6e71");break;case"coolmonochrome":root.style.setProperty("--main-bg-color","#e0fbfc"),root.style.setProperty("--alternate-bg-color","#c2dfe3"),root.style.setProperty("--main-color","#253237"),root.style.setProperty("--accent-color","#5c6b73"),root.style.setProperty("--overlay-background","#e0fbfc"),root.style.setProperty("--menu-color","#9db4c0");break;case"darkred":root.style.setProperty("--main-bg-color","#edddd4"),root.style.setProperty("--alternate-bg-color","#cfbdb2"),root.style.setProperty("--main-color","#283d3b"),root.style.setProperty("--accent-color","#c44536"),root.style.setProperty("--overlay-background","#edddd4"),root.style.setProperty("--menu-color","#772e25");break;case"ice-cream-cone":root.style.setProperty("--main-bg-color","#faf9f9"),root.style.setProperty("--alternate-bg-color","#ffd6ba"),root.style.setProperty("--main-color","#555b6e"),root.style.setProperty("--accent-color","#89b0ae"),root.style.setProperty("--overlay-background","#faf9f9"),root.style.setProperty("--menu-color","#bee3db");break;case"fiery-earth":root.style.setProperty("--main-bg-color","#fffcf2"),root.style.setProperty("--alternate-bg-color","#ccc5b9"),root.style.setProperty("--main-color","#252422"),root.style.setProperty("--accent-color","#eb5e28"),root.style.setProperty("--overlay-background","#fffcf2"),root.style.setProperty("--menu-color","#403d39");break;case"bee":root.style.setProperty("--main-bg-color","#e8eddf"),root.style.setProperty("--alternate-bg-color","#cfdbd5"),root.style.setProperty("--main-color","#242423"),root.style.setProperty("--accent-color","#f5cb5c"),root.style.setProperty("--overlay-background","#e8eddf"),root.style.setProperty("--menu-color","#333533");break;case"darkblue":root.style.setProperty("--main-bg-color","#e0e1dd"),root.style.setProperty("--alternate-bg-color","#778da9"),root.style.setProperty("--main-color","#0d1b2a"),root.style.setProperty("--accent-color","#1b263b"),root.style.setProperty("--overlay-background","#e0e1dd"),root.style.setProperty("--menu-color","#415a77");break;case"cyanblue":root.style.setProperty("--main-bg-color","#caf0f8"),root.style.setProperty("--alternate-bg-color","#90e0ef"),root.style.setProperty("--main-color","#03045e"),root.style.setProperty("--accent-color","#00b4d8"),root.style.setProperty("--overlay-background","#caf0f8"),root.style.setProperty("--menu-color","#0077b6");break;case"c1blue":root.style.setProperty("--main-bg-color","#e0fbfc"),root.style.setProperty("--alternate-bg-color","#98c1d9"),root.style.setProperty("--main-color","#293241"),root.style.setProperty("--accent-color","#ee6c4d"),root.style.setProperty("--overlay-background","#e0fbfc"),root.style.setProperty("--menu-color","#3d5a80");break;case"purple":root.style.setProperty("--main-bg-color","#f3e9d2"),root.style.setProperty("--alternate-bg-color","#c9ada7"),root.style.setProperty("--main-color","#22223b"),root.style.setProperty("--accent-color","#4a4e69"),root.style.setProperty("--overlay-background","#f3e9d2"),root.style.setProperty("--menu-color","#9a8c98")}}function insertCard(e){const t=document.createElement("h2");t.innerText=e.title,t.classList.add("card__title");const o=document.createElement("p");o.innerText=e.subtitle,o.classList.add("card__subtitle");const r=document.createElement("div");r.appendChild(t),r.appendChild(document.createElement("br")),r.appendChild(o);const l=document.createElement("img");l.classList.add("card__image"),l.setAttribute("src",e.image),l.setAttribute("alt",e.title);const n=document.createElement("div");n.classList.add("card"),n.appendChild(l),n.appendChild(r),n.addEventListener("click",function(t){close_all_dropdowns(),hide_menu();const o=`<h2 id="overlay__news-article__title">${e.title}</h2>`+`<h4 id="overlay__news-article__subtitle">${e.subtitle}</h4>`+`<img id="overlay__news-article__image" src='${e.image}' alt='${e.title}'/>`+`<br><br><h6 id="overlay__news-article__date">${e.last_edited}</h6><hr>`,r=`<br><br><hr>Leer articulo original <a href="${e.url}">aqui</a>`;overlay.children[0].innerHTML='<i id="overlay__news-article__close-button" class="fa fa-fw fa-times-circle" onclick="overlay_off()"></i>'+o+e.article.replace(/\n/g,"<br>")+r,overlay_on()}),n.animate([{opacity:0},{opacity:1}],{duration:300,iterations:1}),n.classList.add(e.paper+"__watermark"),container.appendChild(n)}function add_articles(e){articles_arr=Object.values(e).flat();let t=DEFAULT_SORT_ORDER;switch(localStorage.getItem("selected_order")){case"inverse_chronological_order":t=0;break;case"chronological_order":t=1;break;case"long-ascending":t=2;break;case"long-descending":t=3}const o=[function(e,t){const o=new Date(e.last_edited.replace(/ \|/g,""));return new Date(t.last_edited.replace(/ \|/g,""))-o},function(e,t){return new Date(e.last_edited.replace(/ \|/g,""))-new Date(t.last_edited.replace(/ \|/g,""))},function(e,t){return e.article.length-t.article.length},function(e,t){const o=e.article.length;return t.article.length-o}];articles_arr.sort(o[t]);let r=keywords_input.value.toLowerCase().trim();r=r.includes(",")?r.split(","):[r];for(let e=0,t=articles_arr.length;e<t;e++)for(const t of r){const o=articles_arr[e],r=(o.title+o.subtitle+o.article).toLowerCase();(""===t||r.includes(t))&&insertCard(o)}}function update_screen(e=!0){container.innerHTML="";let t=JSON.parse(localStorage.getItem("selected_newspapers"));e?(loader_on(),axios.get(`${api_server}/api/v1/services/news_scraping?papers=${t.join(",")}&max_articles=${max_articles}`).then(function(e){previous_articles=e,loader_off(),add_articles(e)}).catch(function(e){console.log(e)})):add_articles(previous_articles)}max_articles_input.min=1,max_articles_input.max=MAX_ARTICLES,window.addEventListener("load",function(e){update_screen(),"string"==typeof localStorage.getItem("theme")?set_theme(localStorage.getItem("theme")):set_theme("default"),restore_preferences(),store_preferences()});