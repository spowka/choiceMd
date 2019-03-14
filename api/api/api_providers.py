import os
import string
import math
import base64
import re
import random
from flask import Flask, request, Blueprint, Response, current_app, send_file, jsonify, send_from_directory
import requests
import jsonpickle
from api.common import *
from model.provider import *
from oauth import *

api_providers = Blueprint('api_providers', __name__)
oauth = get_oauth_provider()

@api_providers.route("/providers", methods=["GET"])
def api_providers_get():
    sort_by, results_page, results_page_size = get_select_params(
        request, allowed_sort_by=["name"])

    (location_lat, location_lng, location_distance, name, id_provider_type, id_specialty_type, id_facility_type, id_organization_type, id_user) = parse_url_params(request, [
        "location_lat", "location_lng", "location_distance", "name", "id_provider_type", "id_specialty_type", "id_facility_type", "id_organization_type", "id_user"])

    providers, result_count = Provider.get_providers(
        location_lat=location_lat,
        location_lng=location_lng,
        location_distance=location_distance,
        name=name,
        id_provider_type=id_provider_type,
        id_specialty_type=id_specialty_type,
        id_facility_type=id_facility_type,
        id_organization_type=id_organization_type,
        id_user=id_user,
        sort_by=sort_by,
        results_page=results_page,
        results_page_size=results_page_size)

    total_pages = math.ceil(result_count / results_page_size)
    json_str = jsonpickle.encode({"current_page": results_page, "page_size": results_page_size, "total_count": result_count,
                                  "total_pages": total_pages, "sort_by": sort_by, "results": providers}, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")


@api_providers.route("/providers/<int:id_provider>", methods=["GET"])
def api_provider_get(id_provider):
    try:
        provider = Provider(id_provider=id_provider)
    except:
        return Response("provider not found", 404)

    return Response(jsonpickle.encode(provider, unpicklable=False), status=200, mimetype="application/json")


@api_providers.route("/providers", methods=["POST"])
@oauth.require_oauth()
def api_providers_post():
    is_json_ok, data, json_error = parse_json(request.data, [
        "id_provider_type",
        "name",
        "address_street1",
        "address_street2",
        "address_zipcode",
        "address_city",
        "address_state",
        "lat",
        "lng",
        "contact_name",
        "email",
        "website",
        "phone_number",
        "doctor_firstname",
        "doctor_lastname",
        "doctor_middlename",
        "doctor_name",
        "doctor_gender",
        "organization_types",
        "facility_types",
        "specialty_types"
        ])

    if not is_json_ok:
        return Response(json_error, 400)

    if not (request.oauth.user.is_admin) and not (request.oauth.user.id_user == data["id_user"]):
        return Response("unauthorized user", 401)

    provider = Provider()		    
    provider.id_user = data["id_user"]
    provider.id_provider_type = data["id_provider_type"]
    provider.name = data["name"]
    provider.address_street1 = data["address_street1"]
    provider.address_street2 = data["address_street2"]
    provider.address_zipcode = data["address_zipcode"]
    provider.address_city = data["address_city"]
    provider.address_state = data["address_state"]
    provider.lat = data["lat"]
    provider.lng = data["lng"]
    provider.contact_name = data["contact_name"]
    provider.email = data["email"]
    provider.website = data["website"]
    provider.phone_number = data["phone_number"]
    provider.doctor_firstname = data["doctor_firstname"]
    provider.doctor_lastname = data["doctor_lastname"]
    provider.doctor_middlename = data["doctor_middlename"]
    provider.doctor_name = data["doctor_name"]
    provider.doctor_gender = data["doctor_gender"]

    provider.organization_types = data["organization_types"]
    provider.facility_types = data["facility_types"]
    provider.specialty_types = data["specialty_types"]

    provider.insert()
    provider.reload()

    json_str = jsonpickle.encode(provider, unpicklable=False)

    return Response(response=json_str, status=201, mimetype="application/json")


@api_providers.route("/providers/<int:id_provider>", methods=["PUT"])
@oauth.require_oauth()
def api_providers_id_put(id_provider):
    is_json_ok, data, json_error = parse_json(request.data, [
        "id_provider_type",
        "name",
        "address_street1",
        "address_street2",
        "address_zipcode",
        "address_city",
        "address_state",
        "lat",
        "lng",
        "contact_name",
        "email",
        "website",
        "phone_number",
        "doctor_firstname",
        "doctor_lastname",
        "doctor_middlename",
        "doctor_name",
        "doctor_gender",
        "organization_types",
        "facility_types",
        "specialty_types"])

    if not is_json_ok:
        return Response(json_error, 400)

    try:
        provider = Provider(id_provider = id_provider)
    except:	
        return Response("not found", 404)     


    if not (request.oauth.user.is_admin) and not (request.oauth.user.id_user == data["id_user"] and request.oauth.user.id_user == provider.id_user):
        return Response("unauthorized user", 401)

    
    provider.id_user = data["id_user"]
    provider.id_provider_type = data["id_provider_type"]
    provider.name = data["name"]
    provider.address_street1 = data["address_street1"]
    provider.address_street2 = data["address_street2"]
    provider.address_zipcode = data["address_zipcode"]
    provider.address_city = data["address_city"]
    provider.address_state = data["address_state"]
    provider.lat = data["lat"]
    provider.lng = data["lng"]
    provider.contact_name = data["contact_name"]
    provider.email = data["email"]
    provider.website = data["website"]
    provider.phone_number = data["phone_number"]
    provider.doctor_firstname = data["doctor_firstname"]
    provider.doctor_lastname = data["doctor_lastname"]
    provider.doctor_middlename = data["doctor_middlename"]
    provider.doctor_name = data["doctor_name"]
    provider.doctor_gender = data["doctor_gender"]

    provider.organization_types = data["organization_types"]
    provider.facility_types = data["facility_types"]
    provider.specialty_types = data["specialty_types"]    

    provider.update()
    provider.reload()

    json_str = jsonpickle.encode(provider, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")  

@api_providers.route("/providers/<int:id_provider>/like", methods=["POST"])
def api_provider_like_post(id_provider):
    try:
        provider = Provider(id_provider = id_provider)
    except:
        return Response("not found", 404)     

    provider.likes = provider.likes + 1

    provider.update()
    provider.reload()

    json_str = jsonpickle.encode(provider, unpicklable=False)

    return Response(response=json_str, status=200, mimetype="application/json")  


@api_providers.route("/providers/<int:id_provider>", methods=["DELETE"])
@oauth.require_oauth()
def api_providers_id_delete(id_provider):
    try:
        provider = Provider(id_provider=id_provider)
    except:
        return Response("provider not found", 404)

    if not (request.oauth.user.is_admin) and not (request.oauth.user.id_user == provider.id_user):
        return Response("unauthorized user", 401)        

    provider.delete()

    return Response("deleted", status=200)    