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

api_contact = Blueprint('api_contact', __name__)


@api_contact.route("/contact", methods=["POST"])
def api_contact_post():
    is_json_ok, data, json_error = parse_json(request.data, [
        "first_name",
        "email",
        "purpose",
        "messsage"
    ])

    if not is_json_ok:
        return Response(json_error, 400)

    # TODO: add mail send

    return Response(response="ok", status=200)
