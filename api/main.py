import sys
import os
from flask import Flask, redirect
from db import *
from api import api_providers, api_events, api_newsletter, api_contact, api_locations, api_oauth, api_users, api_newsfeed
import requests
from flask_cors import CORS
from oauth import *
from utils.mail import *

app = Flask(__name__)
app.config.from_pyfile("config.py")
app.debug = True
app.threaded = True

app.register_blueprint(api_providers.api_providers, url_prefix='/api/v1')
app.register_blueprint(api_events.api_events, url_prefix='/api/v1')
app.register_blueprint(api_newsletter.api_newsletter, url_prefix='/api/v1')
app.register_blueprint(api_contact.api_contact, url_prefix='/api/v1')
app.register_blueprint(api_locations.api_locations, url_prefix='/api/v1')
app.register_blueprint(api_oauth.api_oauth, url_prefix='/api/v1')
app.register_blueprint(api_users.api_users, url_prefix='/api/v1')
app.register_blueprint(api_newsfeed.api_newsfeed, url_prefix='/api/v1')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
init_pg(app)
init_mail(app)
oauth = init_oauth(app)

@app.route("/")
def index():    
    return "ChoiceMD API v1.0"

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
