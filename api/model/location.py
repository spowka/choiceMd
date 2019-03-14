from db import *
import datetime


class Location(object):

    def __init__(self, id_location=None, db_row=None):
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_location != None:
            rows, _ = self.db_select(id_location=id_location)
            if len(rows) == 0:
                raise KeyError("row not found")
            self.fill_from_data_row(rows[0])

    def fill_from_data_row(self, row):
        self.id_location = row["id_location"]
        self.zip_code = row["zip_code"]
        self.name = row["name"]
        self.lat = float(row["lat"])
        self.lng = float(row["lng"])

    @staticmethod
    def db_select(id_location=None):
        return pg_select_rows("\
        select\
            l.id_location,\
            l.name,\
            l.zip_code,\
            l.lat,\
            l.lng\
        from\
            location l\
        where\
            (%(id_location)s is null or l.id_location = %(id_location)s)",
        {
            "id_location": id_location\
        })

    @staticmethod
    def get_locations(id_location=None):
        locations = []

        rows = Location.db_select(
            id_location=id_location)

        for row in rows:
            location = Location()
            location.fill_from_data_row(row)
            locations.append(location)

        return locations
