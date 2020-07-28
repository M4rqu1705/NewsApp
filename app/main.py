import flask
from flask import request, jsonify, render_template
from flask_cors import CORS
import scraper

app = flask.Flask(__name__)
cors = CORS(app)
app.config['DEBUG'] = True

@app.route("/", methods=['GET'])
def home():
    return render_template("index.html")


@app.route('/api/v1/services/news_scraping/all', methods=['GET'])
def scrape_all():
    
    if 'max_articles' in request.args:
        try:
            scraper.MAX_ARTICLES = int(request.args['max_articles'])
        except TypeError:
            return 'Error: max_articles is not a number. Please enter a number'

    outputs = {}

    outputs['endi'] = scraper.endi()
    outputs['vocero'] = scraper.vocero()
    outputs['primera_hora'] = scraper.primera_hora()
    outputs['metropr'] = scraper.metropr()
    outputs['claridad'] = scraper.claridad()

    return jsonify(outputs)

@app.route('/api/v1/services/news_scraping', methods=['GET'])
def scrape_specific():
    
    if 'max_articles' in request.args:
        try:
            scraper.MAX_ARTICLES = int(request.args['max_articles'])
        except TypeError:
            return 'Error: max_articles is not a number. Please enter a number'

    outputs = {}
    if 'paper' in request.args:
        newspaper = request.args['paper']

        if newspaper in scraper.COMPLETE_NEWSPAPERS:
            outputs[newspaper] = scraper.FUNCTIONS[newspaper]()

    elif 'papers' in request.args:
        newspapers = request.args['papers'].split(',')
        
        for newspaper in newspapers:
            if newspaper in scraper.COMPLETE_NEWSPAPERS:
                outputs[newspaper] = scraper.FUNCTIONS[newspaper]()

    else:
        return 'Error: desired newspaper(s) not specified. Please specify newspaper(s) to scrape through'

    return jsonify(outputs)

if __name__ == "__main__":
    app.run()
