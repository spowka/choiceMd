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
from model.location import *

api_locations = Blueprint('api_locations', __name__)


@api_locations.route("/locations", methods=["GET"])
def api_locations_get():
    locations = Location.get_locations()

    json_str = jsonpickle.encode(locations, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")