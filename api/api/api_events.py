import os
import string
import math
import base64
import re
import random
from flask import Flask, request, Blueprint, Response, current_app, send_file, jsonify, send_from_directory
import requests
import jsonpickle
import dateutil.parser as dp
from api.common import *
from model.event import *
from model.event_category import *
from oauth import *

api_events = Blueprint('api_events', __name__)
oauth = get_oauth_provider()


@api_events.route("/events", methods=["GET"])
def api_events_get():
    sort_by, results_page, results_page_size = get_select_params(
        request, allowed_sort_by=["name"])

    (date_from, date_to, id_event_category, name) = parse_url_params(request, [
        "date_from", "date_to", "id_event_category", "name"])

    events, result_count = Event.get_events(
        date_from=date_from,
        date_to=date_to,
        id_event_category=id_event_category,
        name=name,
        sort_by=sort_by,
        results_page=results_page,
        results_page_size=results_page_size
    )

    total_pages = math.ceil(result_count / results_page_size)
    json_str = jsonpickle.encode({"current_page": results_page, "page_size": results_page_size, "total_count": result_count,
                                  "total_pages": total_pages, "sort_by": sort_by, "results": events}, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")


@api_events.route("/events/<int:id_event>", methods=["GET"])
def api_events_id_get(id_event):
    try:
        event = Event(id_event=id_event)
    except:
        return Response("event not found", 404)

    return Response(jsonpickle.encode(event, unpicklable=False), status=200, mimetype="application/json")


@api_events.route("/events/categories", methods=["GET"])
def api_event_categories_get():
    data = EventCategory.get_categories()

    json_str = jsonpickle.encode(data, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")


@api_events.route("/events", methods=["POST"])
@oauth.require_oauth()
def api_events_post():
    is_json_ok, data, json_error = parse_json(request.data, [
        "id_event_category",
        "name",
        "date_from",
        "date_to",
        "link"
    ])

    if not is_json_ok:
        return Response(json_error, 400)

    if not (request.oauth.user.is_admin):
        return Response("unauthorized user", 401)

    event = Event()
    event.id_event_category = data["id_event_category"]
    event.name = data["name"]
    event.date_from = data["date_from"]
    event.date_to = data["date_to"]
    event.link = data["link"]

    event.insert()
    event.reload()

    json_str = jsonpickle.encode(event, unpicklable=False)

    return Response(response=json_str, status=201, mimetype="application/json")


@api_events.route("/events/<int:id_event>", methods=["PUT"])
@oauth.require_oauth()
def api_events_id_put(id_event):
    is_json_ok, data, json_error = parse_json(request.data, [
        "id_event_category",
        "name",
        "date_from",
        "date_to",
        "link"
    ])

    if not is_json_ok:
        return Response(json_error, 400)

    try:
        event = Event(id_event=id_event)
    except:
        return Response("not found", 404)

    if not (request.oauth.user.is_admin):
        return Response("unauthorized user", 401)

    event = Event()
    event.id_event = id_event
    event.id_event_category = data["id_event_category"]
    event.name = data["name"]
    event.date_from = data["date_from"]
    event.date_to = data["date_to"]
    event.link = data["link"]

    event.update()
    event.reload()

    json_str = jsonpickle.encode(event, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")


@api_events.route("/events/<int:id_event>", methods=["DELETE"])
@oauth.require_oauth()
def api_events_id_delete(id_event):
    try:
        event = Event(id_event=id_event)
    except:
        return Response("event not found", 404)

    if not (request.oauth.user.is_admin):
        return Response("unauthorized user", 401)

    event.delete()

    return Response("deleted", status=200)
