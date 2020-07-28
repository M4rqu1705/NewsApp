# Thank you https://beckernick.github.io/faster-web-scraping-python/

import bs4
import requests
import xmltodict
#  import re
import datetime as dt
import concurrent.futures
#  import time

MAX_THREADS = 50
DEBUG = False
MAX_ARTICLES = 10

def retrieve_site(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        response = requests.get(url, headers=headers)

        return response

    except Exception:
        return None

def endi():
    output = []

    def process_article(article):
        # Retrieve information from sitemap
        url = article['loc']
        last_edited = dt.datetime.fromisoformat(article['lastmod'][:-1])

        #  priority = float(article['priority'])
        #  changefreq = article['changefreq']

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

        with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
            futures = executor.map(process_article, articles)
            concurrent.futures.wait(list(filter(None, futures)))

        #  for i, article in enumerate(articles):
            #  if DEBUG:
                #  print(f'{i}', end='')
            #  process_article(article)

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

        with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
            futures = executor.map(process_article, articles)
            concurrent.futures.wait(list(filter(None, futures)))

        #  for i, article in enumerate(articles):
            #  if DEBUG:
                #  print(f'{i}', end='')
            #  process_article(article)

        return output

    else:
        return None

def primera_hora():
    response = retrieve_site('https://www.primerahora.com/arcio/news-sitemap/')

    if response != None:
        articles = xmltodict.parse(response.text)['urlset']['url']

        output = []

        for article in articles:
            url = article['loc']

            title = article['news:news']['news:title']
            title = title.title()

            last_edited = dt.datetime.fromisoformat(article['lastmod'][:-1])

            #  published = dt.datetime.fromisoformat(article['news:news']['news:publication_date'][:-1])
            #  news_name = article['news:news']['news:publication']['news:name']
            #  news_language = article['news:news']['news:publication']['news:language']
            #  changefreq = article['changefreq']

            if DEBUG:
                print(f' - {title} ({last_edited}) - {url}\n')

            output.append({
                'title': title,
                'last_edited': last_edited,
                'url': url,
                })

        return output

    else:
        return None


def metropr():
    response = retrieve_site('https://www.metro.pr/pr/sitemap/news-sitemap.xml')

    if response != None:
        articles = xmltodict.parse(response.text)['urlset']['url']

        output = []

        for article in articles:
            url = article['loc']

            title = article['n:news']['n:title']
            title = title.title()

            last_edited = dt.datetime.fromisoformat(article['n:news']['n:publication_date'])

            #  image_url = article['image:image']['image:loc']
            #  news_name = article['n:news']['n:publication']['n:name']
            #  news_language = article['n:news']['n:publication']['n:language']
            #  keywords = article['n:news']['n:keywords'].split(',')


            if DEBUG:
                print(f' - {title} ({last_edited}) - {url}\n')

            output.append({
                'title': title,
                'last_edited': last_edited,
                'url': url,
                })

        return output

    else:
        return None


def claridad():
    temp = dt.datetime.now()
    year, month = temp.year, str(temp.month).zfill(2)

    response = retrieve_site(f'https://www.claridadpuertorico.com/sitemap-pt-post-{year}-{month}.xml')

    if response != None:
        articles = xmltodict.parse(response.text)['urlset']['url']

        output = []

        for article in articles:
            url = article['loc']

            title = article['loc'].split('/')[-2]
            while '-' in title:
                title = title.replace('-', ' ')
            title = title.title()

            last_edited = dt.datetime.fromisoformat(article['lastmod'])

            #  changefreq = article['changefreq']
            #  priority = article['priority']


            if DEBUG:
                print(f' - {title} ({last_edited}) - {url}\n')

            output.append({
                'title': title,
                'last_edited': last_edited,
                'url': url,
                })

        return output

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
    outputs = {}

    #  outputs['endi'] = endi()
    outputs['vocero'] = vocero()
    breakpoint()
    outputs['primera_hora'] = primera_hora()
    # MAYBE NOTICEL (Es un revolú)
    outputs['metropr'] = metropr()
    outputs['claridad'] = claridad()
