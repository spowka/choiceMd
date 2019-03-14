from db import *
import datetime


class EventCategory(object):

    def __init__(self, id_event_category=None, db_row=None):
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_event_category != None:
            rows, _ = self.db_select(id_event_category=id_event_category)
            if len(rows) == 0:
                raise KeyError("row not found")
            self.fill_from_data_row(rows[0])

    def fill_from_data_row(self, row):
        self.id_event_category = row["id_event_category"]
        self.id_event_category_parent = row["id_event_category_parent"]
        self.name = row["name"]


    def insert(self):
        self.id_event_category = pg_execute("\
        insert into event_category(\
            id_event_category_parent,\
            name\
        )\
        values(%(id_event_category_parent)s, %(name)s) returning id_event_category", 
        {
            "id_event_category_parent": self.id_event_category_parent,
            "name": self.name
        })   


    def update(self):
        pg_execute("\
        update\
            event_category\
        set\
            id_event_category_parent = %(id_event_category_parent)s,\
            name = %(name)s\
        where\
            id_event_category = %(id_event_category)s", 
        {
            "id_event_category": self.id_event_category,
            "id_event_category_parent": self.id_event_category_parent,
            "name": self.name
        })     


    def delete(self):
        pg_execute("\
        delete from\
            event_category\
        where\
            id_event_category = %(id_event_category)s", 
        {
            "id_event_category": self.id_event_category
        })            


    @staticmethod
    def db_select(id_event_category=None):
        return pg_select_rows("\
        select\
            ec.id_event_category,\
            ec.id_event_category_parent,\
            ec.name\
        from\
            event_category ec\
        order by\
            name\
        ", None)

    @staticmethod
    def get_categories(id_event_category=None):
        categories = []

        rows = EventCategory.db_select(
            id_event_category=id_event_category)

        for row in rows:
            category = EventCategory()
            category.fill_from_data_row(row)
            categories.append(category)

        return categories
