import requests
import jsonpickle
import dateutil.parser as dp
import arrow
import math
from flask import Flask, request, Blueprint, Response, current_app, send_file, jsonify, send_from_directory
from oauth import *
from xml.dom import minidom
from api.common import *
from model.newsfeed_article import *

api_newsfeed = Blueprint('api_newsfeed', __name__)
oauth = get_oauth_provider()


@api_newsfeed.route("/newsfeed", methods=["GET"])
def api_newsfeed_get():
    sort_by, results_page, results_page_size = get_select_params(
        request, allowed_sort_by=["name"])

    (name, news_type) = parse_url_params(request, ["name", "news_type"])

    print("Results page size:", results_page_size)

    articles, result_count = NewsfeedArticle.get_articles(
        name=name,
        news_type=news_type,
        results_page=results_page,
        results_page_size=results_page_size
    )

    total_pages = math.ceil(result_count / results_page_size)
    json_str = jsonpickle.encode({"current_page": results_page, "page_size": results_page_size, "total_count": result_count,
                                  "total_pages": total_pages, "results": articles}, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")


@api_newsfeed.route("/newsfeed/<int:id_article>", methods=["GET"])
def api_newsfeed_id_get(id_article):
    try:
        article = NewsfeedArticle(id_article=id_article)
    except:
        return Response("article not found", 404)

    return Response(jsonpickle.encode(article, unpicklable=False), status=200, mimetype="application/json")


@api_newsfeed.route("/newsfeed", methods=["POST"])
@oauth.require_oauth()
def api_newsfeed_post():
    is_json_ok, data, json_error = parse_json(request.data, [
        "archive_date",
        "news_type",
        "headline",
        "blurb",
        "byline",
        "body",
        "feature_blurb",
        "feature_image",
        "attribution",
        "tagline",
        "source",
        "copyright",
        "topic",
        "specialty"
    ])

    if not is_json_ok:
        return Response(json_error, 400)

    if not (request.oauth.user.is_admin):
        return Response("unauthorized user", 401)

    article = NewsfeedArticle()
    article.id_article = NewsfeedArticle.get_max_id() + 1
    article.posting_datetime = arrow.utcnow().for_json()
    article.archive_date = data["archive_date"]
    article.news_type = data["news_type"]
    article.headline = data["headline"]
    article.blurb = data["blurb"]
    article.byline = data["byline"]
    article.body = data["body"]
    article.feature_blurb = data["feature_blurb"]
    article.feature_image = data["feature_image"]
    article.attribution = data["attribution"]
    article.tagline = data["tagline"]
    article.source = data["source"]
    article.copyright = data["copyright"]
    article.topic = data["topic"]
    article.specialty = data["specialty"]

    article.insert()
    article.reload()

    json_str = jsonpickle.encode(article, unpicklable=False)

    return Response(response=json_str, status=201, mimetype="application/json")


@api_newsfeed.route("/newsfeed/<id_article>", methods=["PUT"])
@oauth.require_oauth()
def api_newsfeed_id_put(id_article):
    is_json_ok, data, json_error = parse_json(request.data, [
        "posting_datetime",
        "archive_date",
        "news_type",
        "headline",
        "blurb",
        "byline",
        "body",
        "feature_blurb",
        "feature_image",
        "attribution",
        "tagline",
        "source",
        "copyright",
        "topic",
        "specialty"
    ])

    if not is_json_ok:
        return Response(json_error, 400)

    try:
        article = NewsfeedArticle(id_article=id_article)
    except:
        return Response("not found", 404)

    if not (request.oauth.user.is_admin):
        return Response("unauthorized user", 401)

    article = NewsfeedArticle()
    article.id_article = id_article
    article.posting_datetime = data["posting_datetime"]
    article.archive_date = data["archive_date"]
    article.news_type = data["news_type"]
    article.headline = data["headline"]
    article.blurb = data["blurb"]
    article.byline = data["byline"]
    article.body = data["body"]
    article.feature_blurb = data["feature_blurb"]
    article.feature_image = data["feature_image"]
    article.attribution = data["attribution"]
    article.tagline = data["tagline"]
    article.source = data["source"]
    article.copyright = data["copyright"]
    article.topic = data["topic"]
    article.specialty = data["specialty"]

    article.update()
    article.reload()

    json_str = jsonpickle.encode(article, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")


@api_newsfeed.route("/newsfeed/<int:id_article>", methods=["DELETE"])
@oauth.require_oauth()
def api_newsfeed_id_delete(id_article):
    try:
        article = NewsfeedArticle(id_article=id_article)
    except:
        return Response("article not found", 404)

    if not (request.oauth.user.is_admin):
        return Response("unauthorized user", 401)

    article.delete()

    return Response("deleted", status=200)


def fetch_newsfeed_articles(file_name):
    xmldoc = minidom.parse(file_name)

    def article_iter(article):
        id_article = article.attributes["ID"].value
        article_row = NewsfeedArticle.get_article_by_id(id_article=id_article)
        print(article_row)
        if len(article_row) > 0:
            return None
        news_type = article.getElementsByTagName('NEWS_TYPE')
        headline = article.getElementsByTagName('HEADLINE')
        blurb = article.getElementsByTagName('BLURB')
        byline = article.getElementsByTagName('BYLINE')
        body = article.getElementsByTagName('BODY')
        feature_blurb = article.getElementsByTagName('FEATURE_BLURB')
        feature_image = article.getElementsByTagName('FEATURE_IMAGE')
        attribution = article.getElementsByTagName('ATTRIBUTION')
        tagline = article.getElementsByTagName('TAGLINE')
        source = article.getElementsByTagName('SOURCE')
        copyright = article.getElementsByTagName('COPYRIGHT')
        topic = article.getElementsByTagName('TOPIC')
        specialty = article.getElementsByTagName('SPECIALTY')
        return (
            id_article,
            str(arrow.get(article.attributes["POSTING_DATE"].value + " " +
                          article.attributes["POSTING_TIME"].value, 'D-MMM-YYYY HH:mm').format("YYYY-MM-DD HH:mm:ss")),
            str(arrow.get(
                article.attributes["ARCHIVE_DATE"].value, 'D-MMM-YYYY').format("YYYY-MM-DD HH:mm:ss")),
            news_type[0].childNodes[0].nodeValue if len(
                news_type) > 0 and len(news_type[0].childNodes) > 0 else None,
            headline[0].childNodes[0].nodeValue if len(
                headline) > 0 and len(headline[0].childNodes) > 0 else None,
            blurb[0].childNodes[0].nodeValue if len(
                blurb) > 0 and len(blurb[0] .childNodes) > 0 else None,
            byline[0].childNodes[0].nodeValue if len(
                byline) > 0 and len(byline[0].childNodes) > 0 else None,
            body[0].childNodes[0].nodeValue if len(
                body) > 0 and len(body[0].childNodes) > 0 else None,
            feature_blurb[0].childNodes[0].nodeValue if len(
                feature_blurb) > 0 and len(feature_blurb[0].childNodes) > 0 else None,
            feature_image[0].childNodes[0].nodeValue if len(
                feature_image) > 0 and len(feature_image[0].childNodes) > 0 else None,
            attribution[0].childNodes[0].nodeValue if len(
                attribution) > 0 and len(attribution[0].childNodes) else None,
            tagline[0].childNodes[0].nodeValue if len(
                tagline) > 0 and len(tagline[0].childNodes) > 0 else None,
            source[0].childNodes[0].nodeValue if len(
                source) > 0 and len(source[0].childNodes) > 0 else None,
            copyright[0].childNodes[0].nodeValue if len(
                copyright) > 0 and len(copyright[0].childNodes) > 0 else None,
            topic[0].attributes["ID"].value,
            specialty[0].childNodes[0].nodeValue if len(
                article.getElementsByTagName('SPECIALTY')) > 0 else None
        )

    articles = list(map(article_iter, xmldoc.getElementsByTagName('ARTICLE')))
    unique_articles = list(filter(lambda article: article != None, articles))
    print(unique_articles)
    NewsfeedArticle.insert_all(rows=unique_articles)

    return unique_articles
