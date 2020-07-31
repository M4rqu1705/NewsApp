#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Thank you https://beckernick.github.io/faster-web-scraping-python/

import bs4
import requests
import xmltodict
import datetime as dt
import concurrent.futures
import json
import pytz

MAX_THREADS = 50
DEBUG = False
SYNCHRONOUS = False
MAX_ARTICLES = 100
SECONDS_UNTIL_OLD = 30 * 60
desired_timezone = pytz.timezone("America/Puerto_Rico")

def retrieve_site(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        response = requests.get(url, headers=headers)

        return response

    except Exception:
        return None

def format(output):
    # Make sure datetimes have the correct type
    for i, el in enumerate(output):
        if isinstance(el['last_edited'], dt.datetime):
            el['last_edited'] = el['last_edited']
        else:
            el['last_edited'] = dt.datetime.strptime(el['last_edited'], "%b %d, %Y | %I:%M:%S %p")

        # Convert to string to prepare for display
        output[i]['last_edited'] = el['last_edited'].strftime("%b %d, %Y | %I:%M:%S %p")

    return output

def retrieve_cache(newspaper, amount):
    cache = dict()

    # Extract cache from file
    with open("cache.json", "r+") as fp:
        cache = json.load(fp)

    articles = cache[newspaper][-amount:]
    return articles

def store_cache(articles, newspaper):
    cache = dict()

    # Extract cache from file
    with open("cache.json", "r+") as fp:
        cache = json.load(fp)

    # Append recently-added articles to the list of articles for the specific newspaper ...
    for article in articles:

        recently_reset = False
        matching_index = -1
        for i, item in enumerate(cache[newspaper]):
            if article["url"].lower().strip() == item["url"].lower().strip():
                matching_index = i
                if  dt.datetime.now().timestamp() - SECONDS_UNTIL_OLD > item["last_reset"]:
                    recently_reset = True
                break

        # Only if it hasn't been reset within the last `SECONDS_UNTIL_OLD`
        article["last_reset"] = dt.datetime.now().timestamp()
        if not recently_reset and matching_index >= 0:
            cache[newspaper][i] = article
        elif matching_index == -1:
            cache[newspaper].append(article)

    # Remove "old" articles (more than SECONDS_UNTIL_OLD since last reset)
    cache[newspaper] = [item for item in cache[newspaper] if dt.datetime.now().timestamp() - SECONDS_UNTIL_OLD < item["last_reset"] ]


    # Store cache back to file
    with open("cache.json", "w+") as fp:
        cache = json.dump(cache, fp)


def endi():
    output = []

    def process_article(article):
        # Retrieve information from sitemap
        url = article['loc']
        last_edited = dt.datetime.fromisoformat(article['lastmod'][:-1])

        #  priority = float(article['priority'])
        #  changefreq = article['changefreq']

        cache = retrieve_cache("endi", 0)
        for item in cache:
            # If urls match, the article must be the same, so return cached article
            if url.lower().strip() == item['url'].lower().strip():
                del item["last_reset"]
                output.append(item)
                return

        # Retrieve article's url to extract titles, image, and content
        response = retrieve_site(url)

        if response != None and response.ok:
            soup = bs4.BeautifulSoup(response.text, 'html.parser')

            # Retrieve title
            bs4_title = soup.select_one('h1.title')
            title = ''
            if bs4_title == None:
                title = url.split('/')[-2]
                while '-' in title:
                    title = title.replace('-', ' ')
                title = title.title()
            else:
                title = bs4_title.text.strip()

            # Retrieve subtitle
            bs4_subtitle = soup.select_one('h1.title + h2')
            subtitle = ''
            if bs4_subtitle != None:
                subtitle = bs4_subtitle.text.strip()

            # Retrieve image
            bs4_image = soup.select_one('picture.ResponsiveImage > img.ResponsiveImage__img')
            image_url = ''
            if bs4_image != None:
                image_url = bs4_image['src']

            # Retrieve article content
            bs4_article_body = soup.select_one('div.article-body')
            if bs4_article_body == None:
                bs4_article_body = soup.select_one('div.story-post')
                title += " (Opinión)"
            bs4_p = bs4_article_body.select('p.content-element')
            content = '\n\n'.join([p.text.strip() for p in bs4_p])

            if DEBUG:
                print(f' - {title[0:10]}… ({last_edited}) - {content[0:20]}… \n')

            output.append({
                'title': title,
                'subtitle': subtitle,
                'last_edited': last_edited,
                'image': image_url,
                'article': content,
                'url': url,
                'paper': 'endi'
                })

    response = retrieve_site('https://www.elnuevodia.com/arcio/sitemap/')

    if response != None and response.ok:
        articles = xmltodict.parse(response.text)['urlset']['url']
        if len(articles) > MAX_ARTICLES:
            articles = articles[0:MAX_ARTICLES]

        threads = min(MAX_THREADS, MAX_ARTICLES)

        if SYNCHRONOUS:
            for i, article in enumerate(articles):
                if DEBUG:
                    print(f'{i}', end='')
                process_article(article)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
                futures = executor.map(process_article, articles)
                concurrent.futures.wait(list(filter(None, futures)))

        output = format(output)

        store_cache(output, 'endi')

        return output


    else:
        return None


def vocero():
    output = []

    def process_article(article):
        # Retrieve information from sitemap
        url = article['loc']
        last_edited = dt.datetime.fromisoformat(article['news:news']['news:publication_date'])

        #  title = article['news:news']['news:title']
        #  title = title.title()
        #  keywords = article['news:news']['news:keywords'].split(',')
        #  news_name = article['news:news']['news:publication']['news:name']
        #  news_language = article['news:news']['news:publication']['news:language']

        cache = retrieve_cache("vocero", 0)
        for item in cache:
            # If urls match, the article must be the same, so return cached article
            if url.lower().strip() == item['url'].lower().strip():
                del item["last_reset"]
                output.append(item)
                return

        # Retrieve article's url to extract titles, image, and content
        response = retrieve_site(url)

        if response != None and response.ok:
            soup = bs4.BeautifulSoup(response.text, 'html.parser')

            # Retrieve title
            bs4_title = soup.select_one('h1.headline')
            title = ''
            if bs4_title != None:
                title = bs4_title.text.strip()

            # Retrieve subtitle
            bs4_subtitle = soup.select_one('h1.headline + h2.subhead')
            subtitle = ''
            if bs4_subtitle != None:
                subtitle = bs4_subtitle.text.strip()

            # Retrieve image
            bs4_image = soup.select_one('figure.photo > div.image > div > img')
            image_url = ''
            if bs4_image != None:
                image_url = bs4_image['src']

            # Retrieve article content
            bs4_article_body = soup.select_one('div[itemprop="articleBody"]')

            bs4_p = bs4_article_body.select('p')
            content = '\n\n'.join([p.text.strip() for p in bs4_p])

            if DEBUG:
                print(f' - {title[0:10]}… ({last_edited}) - {content[0:20]}… \n')

            output.append({
                'title': title,
                'subtitle': subtitle,
                'last_edited': last_edited,
                'image': image_url,
                'article': content,
                'url': url,
                'paper': 'vocero'
                })

    response = retrieve_site('https://www.elvocero.com/tncms/sitemap/news.xml')

    if response != None and response.ok:
        articles = xmltodict.parse(response.text)['urlset']['url']
        if len(articles) > MAX_ARTICLES:
            articles = articles[0:MAX_ARTICLES]

        threads = min(MAX_THREADS, MAX_ARTICLES)

        if SYNCHRONOUS:
            for i, article in enumerate(articles):
                if DEBUG:
                    print(f'{i}', end='')
                process_article(article)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
                futures = executor.map(process_article, articles)
                concurrent.futures.wait(list(filter(None, futures)))

        return format(output)

    else:
        return None


def primera_hora():
    output = []

    def process_article(article):
        # Retrieve information from sitemap
        url = article['loc']

        title = article['news:news']['news:title']
        title = title.title()

        last_edited = dt.datetime.fromisoformat(article['lastmod'][:-1])

        #  published = dt.datetime.fromisoformat(article['news:news']['news:publication_date'][:-1])
        #  news_name = article['news:news']['news:publication']['news:name']
        #  news_language = article['news:news']['news:publication']['news:language']
        #  changefreq = article['changefreq']

        cache = retrieve_cache("primera_hora", 0)
        for item in cache:
            # If urls match, the article must be the same, so return cached article
            if url.lower().strip() == item['url'].lower().strip():
                del item["last_reset"]
                output.append(item)
                return


        # Retrieve article's url to extract titles, image, and content
        response = retrieve_site(url)

        if response != None and response.ok:
            soup = bs4.BeautifulSoup(response.text, 'html.parser')

            opinion = False
            bs4_page_title = soup.select_one('head > title')
            if "opinión" in bs4_page_title.text.lower():
                opinion = True
                return

            article_body = soup.select_one('div.ArticleContent > main')
            if article_body == None:
                opinion = True
                article_body = soup

            # Retrieve title
            bs4_title = article_body.select_one('h1.ArticleHeadline_head')
            title = ''
            if bs4_title != None:
                title = bs4_title.text.strip()
            else:
                opinion = True
                article_body = soup
                bs4_title = article_body.select_one('h1.ArticleHeadline_head')
                if bs4_title != None:
                    title = bs4_title.text.strip()
                else:
                    return

            # Retrieve subtitle
            bs4_subtitle = article_body.select_one('h2.ArticleHeadline_subhead')
            subtitle = ''
            if bs4_subtitle != None:
                subtitle = bs4_subtitle.text.strip()

            # Retrieve image
            if opinion:
                bs4_image = soup.select_one('picture.AuthorBio__image > img.ResponsiveImage__img')
                image_url = ''
                if bs4_image != None:
                    image_url = bs4_image['src']
            else:
                bs4_image = article_body.select_one('figure.ArticlePhotoMain > picture > img.ResponsiveImage__img')
                image_url = ''
                if bs4_image != None:
                    image_url = bs4_image['src']

                # It is assumed that article otherwise has video
                

            # Retrieve article content
            bs4_article_body = article_body.select_one('section.ArticleBody')

            bs4_p = bs4_article_body.select('p')
            # Remove paragraphs which are simply links to other articles
            bs4_p = [p for p in bs4_p if ['a'] != [child.name for child in p.children]]
            content = '\n\n'.join([p.text.strip() for p in bs4_p if p.text.strip().lower() !=
                "publicidad"])

            if DEBUG:
                print(f' - {title[0:10]}… ({last_edited}) - {content[0:20]}… \n')

            output.append({
                'title': title,
                'subtitle': subtitle,
                'last_edited': last_edited,
                'image': image_url,
                'article': content,
                'url': url,
                'paper': 'primera_hora'
                })

    response = retrieve_site('https://www.primerahora.com/arcio/news-sitemap/')

    if response != None and response.ok:
        articles = xmltodict.parse(response.text)['urlset']['url']
        if len(articles) > MAX_ARTICLES:
            articles = articles[0:MAX_ARTICLES]

        threads = min(MAX_THREADS, MAX_ARTICLES)

        if SYNCHRONOUS:
            for i, article in enumerate(articles):
                if DEBUG:
                    print(f'{i}', end='')
                process_article(article)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
                futures = executor.map(process_article, articles)
                concurrent.futures.wait(list(filter(None, futures)))

        return format(output)

    else:
        return None


def metropr():
    output = []

    def process_article(article):
        # Retrieve information from sitemap
        url = article['loc']

        title = article['n:news']['n:title']
        title = title.title()

        last_edited = dt.datetime.fromisoformat(article['n:news']['n:publication_date'])

        #  image_url = article['image:image']['image:loc']
        #  news_name = article['n:news']['n:publication']['n:name']
        #  news_language = article['n:news']['n:publication']['n:language']
        #  keywords = article['n:news']['n:keywords'].split(',')

        cache = retrieve_cache("metropr", 0)
        for item in cache:
            # If urls match, the article must be the same, so return cached article
            if url.lower().strip() == item['url'].lower().strip():
                del item["last_reset"]
                output.append(item)
                return

        # Retrieve article's url to extract titles, image, and content
        response = retrieve_site(url)

        if response != None and response.ok:
            soup = bs4.BeautifulSoup(response.text, 'html.parser')

            article_body = soup.select_one('article.main-article')

            # Retrieve title
            bs4_title = article_body.select_one('header.article-header > h1.article-title')
            title = ''
            if bs4_title != None:
                title = bs4_title.text.strip()

            # Retrieve subtitle
            bs4_subtitle = article_body.select_one('header.article-header > h2.excerpt')
            subtitle = ''
            if bs4_subtitle != None:
                subtitle = bs4_subtitle.text.strip()

            # Retrieve image
            bs4_image = article_body.select_one('img[data-backmedia="true"]')
            image_url = ''
            if bs4_image != None:
                image_url = bs4_image['src']

            # Retrieve article content
            content = ""
            try:
                bs4_article_body = soup.select_one('div.resumen')

                bs4_p = bs4_article_body.findAll(['p', 'h4'])
                content = '\n\n'.join([p.text.strip() for p in bs4_p])
            except:
                return

            if DEBUG:
                print(f' - {title[0:10]}… ({last_edited}) - {content[0:20]}… \n')

            output.append({
                'title': title.encode("iso-8859-1", "ignore").decode("utf-8", "ignore"),
                'subtitle': subtitle.encode("iso-8859-1", "ignore").decode("utf-8", "ignore"),
                'last_edited': last_edited,
                'image': image_url,
                'article': content.encode("iso-8859-1", "ignore").decode("utf-8", "ignore"),
                'url': url,
                'paper': 'metropr'
                })

    response = retrieve_site('https://www.metro.pr/pr/sitemap/news-sitemap.xml')

    if response != None and response.ok:
        articles = xmltodict.parse(response.text)['urlset']['url']
        if len(articles) > MAX_ARTICLES:
            articles = articles[0:MAX_ARTICLES]

        threads = min(MAX_THREADS, MAX_ARTICLES)

        if SYNCHRONOUS:
            for i, article in enumerate(articles):
                if DEBUG:
                    print(f'{i}', end='')
                process_article(article)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
                futures = executor.map(process_article, articles)
                concurrent.futures.wait(list(filter(None, futures)))

        return format(output)

    else:
        return None


def claridad():
    output = []

    def process_article(article):
        # Retrieve information from sitemap
        url = article['loc']
        last_edited = dt.datetime.fromisoformat(article['lastmod'])

        #  changefreq = article['changefreq']
        #  priority = article['priority']

        cache = retrieve_cache("claridad", 0)
        for item in cache:
            # If urls match, the article must be the same, so return cached article
            if url.lower().strip() == item['url'].lower().strip():
                del item["last_reset"]
                output.append(item)
                return

        # Retrieve article's url to extract titles, image, and content
        response = retrieve_site(url)

        if response != None and response.ok:
            soup = bs4.BeautifulSoup(response.text, 'html.parser')

            # Retrieve title
            bs4_title = soup.select_one('header.entry-header > h1')
            title = ''
            if bs4_title != None:
                title = bs4_title.text.strip()

            # There is no subtitle
            subtitle = ''

            # Retrieve image
            bs4_image = soup.select_one('main.site-main > article.post > div > img')
            image_url = ''
            if bs4_image != None:
                image_url = bs4_image['src']
            else:
                return

            # Retrieve article content
            bs4_article_body = soup.select_one('div.entry-content')

            bs4_p = bs4_article_body.findAll(['p', 'ul'])
            content = '\n\n'.join([p.text.strip() for p in bs4_p])


            # Use some initial words as subtitle
            subtitle = content[0:50].split("/")[0] + "…"

            if DEBUG:
                print(f' - {title[0:10]}… ({last_edited}) - {content[0:20]}… \n')

            output.append({
                'title': title,
                'subtitle': subtitle,
                'last_edited': last_edited,
                'image': image_url,
                'article': content,
                'url': url,
                'paper': 'claridad'
                })

    year = dt.datetime.now().year
    month = dt.datetime.now().month
    
    year = str(year).zfill(4)
    month = str(month).zfill(2)

    response = retrieve_site(f'https://www.claridadpuertorico.com/sitemap-pt-post-{year}-{month}.xml')

    if response != None and response.ok:
        articles = xmltodict.parse(response.text)['urlset']['url']
        if len(articles) > MAX_ARTICLES:
            articles = articles[0:MAX_ARTICLES]

        threads = min(MAX_THREADS, MAX_ARTICLES)

        if SYNCHRONOUS:
            for i, article in enumerate(articles):
                if DEBUG:
                    print(f'{i}', end='')
                process_article(article)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
                futures = executor.map(process_article, articles)
                concurrent.futures.wait(list(filter(None, futures)))

        return format(output)

    else:
        return None


FUNCTIONS = {
        'endi': endi,
        'vocero': vocero,
        'primera_hora': primera_hora,
        'metropr': metropr,
        'claridad': claridad
        }
COMPLETE_NEWSPAPERS = list(FUNCTIONS.keys())


if __name__ == "__main__":
    #  outputs = {}

    #  outputs['endi'] = endi()
    #  outputs['vocero'] = vocero()
    #  outputs['primera_hora'] = primera_hora()
    # MAYBE NOTICEL (Es un revolú)
    #  outputs['metropr'] = metropr()
    #  outputs['claridad'] = claridad()

    with open("cache.json", "x+") as fp:
        sample_cache = {
                "endi": [],
                "vocero": [],
                "primera_hora": [],
                "metropr": [],
                "claridad": [],
                }

        json.dump(sample_cache, fp)
