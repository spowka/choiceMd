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
from model.newsletter_member import *

api_newsletter = Blueprint('api_newsletter', __name__)


@api_newsletter.route("/newsletter", methods=["POST"])
def api_newsletter_post():
    is_json_ok, data, json_error = parse_json(request.data, [
        "email"
    ])

    if not is_json_ok:
        return Response(json_error, 400)

    member = NewsletterMember.get_member(email=data["email"])

    if not member:
        member = NewsletterMember()
        member.email = data["email"]
        member.insert()

    return Response(response="ok", status=201)
