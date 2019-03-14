from db import *
import datetime


class Provider(object):
    def __init__(self, id_provider=None, db_row=None):
        self.facility_types = []
        self.organization_types = []
        self.specialty_types = []
        
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_provider != None:
            rows, _ = self.db_select(id_provider=id_provider)
            if len(rows) == 0:
                raise KeyError("row not found")
            self.fill_from_data_row(rows[0])
            self.fill_types()

    def fill_from_data_row(self, row):
        self.id_provider = row["id_provider"]
        self.id_user = row["id_member"]
        self.id_provider_type = row["id_provider_type"]
        self.name = row["name"]
        self.address_street1 = row["address_street1"]
        self.address_street2 = row["address_street2"]
        self.address_zipcode = row["address_zipcode"]
        self.address_city = row["address_city"]
        self.address_state = row["address_state"]
        self.contact_name = row["contact_name"]
        self.email = row["email"]
        self.website = row["website"]
        self.phone_number = row["phone_number"]
        self.doctor_firstname = row["doctor_firstname"]
        self.doctor_lastname = row["doctor_lastname"]
        self.doctor_middlename = row["doctor_middlename"]
        self.doctor_name = row["doctor_name"]
        self.doctor_gender = row["doctor_gender"]
        self.provider_type = row["provider_type"]
        self.specialty_type = row["specialty_type"]
        self.likes = row["likes"]
        
        if row["distance_miles"]:
            self.distance_miles = float(row["distance_miles"])
        else:
            self.distance_miles = None

        if row["lat"] and row["lng"]:
            self.lat = float(row["lat"])
            self.lng = float(row["lng"])
        else:
            self.lat = None
            self.lng = None


    def fill_types(self):
        self.facility_types = []

        rows = pg_select_rows("select id_facility_type from provider_facility_type where id_provider = %s", (self.id_provider, ))
        for row in rows:
            self.facility_types.append(row["id_facility_type"])

        self.organization_types = []

        rows = pg_select_rows("select id_organization_type from provider_organization_type where id_provider = %s", (self.id_provider, ))
        for row in rows:
            self.organization_types.append(row["id_organization_type"])            

        self.specialty_types = []

        rows = pg_select_rows("select id_specialty_type from provider_specialty_type where id_provider = %s", (self.id_provider, ))
        for row in rows:
            self.specialty_types.append(row["id_specialty_type"])    


    def insert(self):        
        self.id_provider = pg_execute("\
        insert into provider(\
            id_member,\
            id_provider_type,\
            name,\
            address_street1,\
            address_street2,\
            address_zipcode,\
            address_city,\
            address_state,\
            lat,\
            lng,\
            contact_name,\
            email,\
            website,\
            phone_number,\
            doctor_firstname,\
            doctor_lastname,\
            doctor_middlename,\
            doctor_name,\
            doctor_gender\
        )\
        values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) returning id_provider", 
        (
            self.id_user,
            self.id_provider_type,
            self.name,
            self.address_street1,
            self.address_street2,
            self.address_zipcode,
            self.address_city,
            self.address_state,
            self.lat,
            self.lng,
            self.contact_name,
            self.email,
            self.website,
            self.phone_number,
            self.doctor_firstname,
            self.doctor_lastname,
            self.doctor_middlename,
            self.doctor_name,
            self.doctor_gender
        ))

        self.save_types()


    def update(self):
        pg_execute("\
        update\
            provider\
        set\
            id_member = %s,\
            id_provider_type = %s,\
            name = %s,\
            address_street1 = %s,\
            address_street2 = %s,\
            address_zipcode = %s,\
            address_city = %s,\
            address_state = %s,\
            lat = %s,\
            lng = %s,\
            contact_name = %s,\
            email = %s,\
            website = %s,\
            phone_number = %s,\
            doctor_firstname = %s,\
            doctor_lastname = %s,\
            doctor_middlename = %s,\
            doctor_name = %s,\
            doctor_gender = %s,\
            likes = %s\
        where\
            id_provider = %s",
            (
                self.id_user,
                self.id_provider_type,
                self.name,
                self.address_street1,
                self.address_street2,
                self.address_zipcode,
                self.address_city,
                self.address_state,
                self.lat,
                self.lng,
                self.contact_name,
                self.email,
                self.website,
                self.phone_number,
                self.doctor_firstname,
                self.doctor_lastname,
                self.doctor_middlename,
                self.doctor_name,
                self.doctor_gender,
                self.likes,
                self.id_provider))

        self.save_types()

    def delete(self):        
        pg_execute("delete from provider where id_provider = %s", (self.id_provider, ))

    def reload(self):
        rows, _ = self.db_select(id_provider=self.id_provider)
        self.fill_from_data_row(rows[0])

    def save_types(self):
        pg_execute("delete from provider_facility_type where id_provider = %s", (self.id_provider, ))
        pg_execute("delete from provider_organization_type where id_provider = %s", (self.id_provider, ))
        pg_execute("delete from provider_specialty_type where id_provider = %s", (self.id_provider, ))

        for id in self.facility_types:
            pg_execute("insert into provider_facility_type(id_provider, id_facility_type) values (%s, %s)", (self.id_provider, id))

        for id in self.organization_types:
            pg_execute("insert into provider_organization_type(id_provider, id_organization_type) values (%s, %s)", (self.id_provider, id))
        
        for id in self.specialty_types:
            pg_execute("insert into provider_specialty_type(id_provider, id_specialty_type) values (%s, %s)", (self.id_provider, id))
    
    # @staticmethod
    # def like(id_provider):
    #     rows =  pg_select_rows("select id_provider from provider where id_provider = %s", (id_provider, ))
        
    #     if len(rows) == 0:
    #         return None

    #     pg_execute("update provider set likes = likes + 1 where id_provider = %s", (id_provider, ))
        
    #     return Provider(id_provider=id_provider)
      

    @staticmethod
    def db_select(id_provider = None,
                  location_lat = None,
                  location_lng = None,
                  location_distance = None,
                  name = None,
                  id_provider_type = None,
                  id_specialty_type = None,
                  id_facility_type = None,
                  id_organization_type = None,
                  id_user = None,
                  sort_by = None,
                  results_page = None,
                  results_page_size = None):

        order_string=" order by case when p.lat is null or p.lng is null then 2 else 1 end, distance_miles, coalesce(concat(p.doctor_lastname, ' ', coalesce(p.doctor_middlename, ''), ' ', p.doctor_firstname), p.name), p.id_provider"

        if sort_by:
            sort_by_sanitized=sort_by.replace("'", "").replace('"', '')
            order_string=" order by {0}, p.id_provider".format(sort_by_sanitized)

        limit_string=""

        if results_page and results_page_size:
            start_record=(results_page - 1) * results_page_size
            limit_string=" offset {0} limit {1}".format(
                int(start_record), int(results_page_size))
        else:
            limit_string = " limit 2"

        if name:
            name = "%{0}%".format(name)

        return pg_select_rows_with_count("\
        select\
            count(*) over() as row_count,\
            p.id_provider,\
            p.id_provider_type,\
            p.name,\
            p.address_street1,\
            p.address_street2,\
            p.address_zipcode,\
            p.address_city,\
            p.address_state,\
            p.lat,\
            p.lng,\
            p.contact_name,\
            p.email,\
            p.website,\
            p.phone_number,\
            p.doctor_firstname,\
            p.doctor_lastname,\
            p.doctor_middlename,\
            p.doctor_name,\
            p.doctor_gender,\
            p.id_member,\
            p.likes,\
            pt.name as provider_type,\
            (select string_agg(name, ', ') from specialty_type st inner join provider_specialty_type pst on pst.id_specialty_type = st.id_specialty_type where pst.id_provider = p.id_provider) as specialty_type,\
            case when %(location_lat)s is null or %(location_lng)s is null then 0 else ST_Distance(st_makepoint(%(location_lat)s, %(location_lng)s)::geography, st_makepoint(p.lat, p.lng)::geography) / 1609.34 end as distance_miles\
        from\
            provider p\
        inner join\
            provider_type pt on pt.id_provider_type = p.id_provider_type\
        left join\
            member m on m.id_member = %(id_user)s\
        where\
            (%(id_provider)s is null or p.id_provider = %(id_provider)s)\
            and (%(id_user)s is null or p.id_member = %(id_user)s or m.id_member_role = 1)\
            and (%(id_provider_type)s is null or p.id_provider_type = %(id_provider_type)s)\
            and (%(id_organization_type)s is null or %(id_organization_type)s in (select pot.id_organization_type from provider_organization_type pot where pot.id_provider = p.id_provider))\
            and (%(id_facility_type)s is null or %(id_facility_type)s in (select pft.id_facility_type from provider_facility_type pft where pft.id_provider = p.id_provider))\
            and (%(id_specialty_type)s is null or %(id_specialty_type)s in (select pst.id_specialty_type from provider_specialty_type pst where pst.id_provider = p.id_provider))\
            and (%(name)s is null or %(name)s = '' or p.name ilike %(name)s or p.doctor_name ilike %(name)s)\
            and (%(location_lat)s is null or %(location_lng)s is null or %(location_distance)s is null or case when %(location_lat)s is null or %(location_lng)s is null then 0 else ST_Distance(st_makepoint(%(location_lat)s, %(location_lng)s)::geography, st_makepoint(p.lat, p.lng)::geography) / 1609.34 end <= %(location_distance)s)\
        {0} {1}\
        ".format(order_string, limit_string),
            {"id_provider": id_provider,
             "id_provider_type": id_provider_type,
             "id_organization_type": id_organization_type,
             "id_facility_type": id_facility_type,
             "id_specialty_type": id_specialty_type,
             "name": "%{0}%".format(name) if name != None and name != '' else None,
             "location_lat": location_lat,
             "location_lng": location_lng,
             "location_distance": location_distance,
             "id_user": id_user}
        )

    @staticmethod
    def get_providers(location_lat=None,
                      location_lng=None,
                      location_distance=None,
                      name=None,
                      id_provider_type=None,
                      id_specialty_type=None,
                      id_facility_type=None,
                      id_organization_type=None,
                      id_user=None,
                      sort_by=None,
                      results_page=None,
                      results_page_size=None):

        providers = []

        rows, row_count = Provider.db_select(
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

        for row in rows:
            provider = Provider()
            provider.fill_from_data_row(row)
            providers.append(provider)

        return providers, row_count
