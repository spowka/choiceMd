from db import *
import datetime


class Event(object):

    def __init__(self, id_event=None, db_row=None):
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_event != None:
            rows, _ = self.db_select(id_event=id_event)
            if len(rows) == 0:
                raise KeyError("row not found")
            self.fill_from_data_row(rows[0])

    def fill_from_data_row(self, row):
        self.id_event = row["id_event"]
        self.id_event_category = row["id_event_category"]
        self.name = row["name"]
        self.date_from = row["date_from"]
        self.date_to = row["date_to"]
        self.link = row["link"]
        self.category = row["category"]
        self.id_event_category_parent = row["id_event_category_parent"]

    def insert(self):
        self.id_event = pg_execute("\
        insert into event(\
            id_event_category,\
            name,\
            date_from,\
            date_to,\
            link\
        )\
        values(%(id_event_category)s, %(name)s, %(date_from)s, %(date_to)s, %(link)s) returning id_event",
        {
            "id_event_category": self.id_event_category,
            "name": self.name,
            "date_from": self.date_from,
            "date_to": self.date_to,
            "link": self.link
        })

    def update(self):
        pg_execute("\
        update\
            event\
        set\
            id_event_category = %(id_event_category)s,\
            name = %(name)s,\
            date_from = %(date_from)s,\
            date_to = %(date_to)s,\
            link = %(link)s\
        where\
            id_event = %(id_event)s",
        {
            "id_event": self.id_event,
            "id_event_category": self.id_event_category,
            "name": self.name,
            "date_from": self.date_from,
            "date_to": self.date_to,
            "link": self.link
        })

    def delete(self):
        pg_execute("\
        delete from\
            event\
        where\
            id_event = %(id_event)s",
        {
            "id_event": self.id_event
        })

    def reload(self):
        rows, _ = self.db_select(id_event=self.id_event)
        self.fill_from_data_row(rows[0])        

    @staticmethod
    def db_select(id_event = None,
                  id_event_category = None,
                  name = None,
                  date_from = None,
                  date_to = None,
                  sort_by = None,
                  results_page = None,
                  results_page_size = None):

        limit_string=""

        if results_page and results_page_size:
            start_record=(results_page - 1) * results_page_size
            limit_string=" offset {0} limit {1}".format(
                int(start_record), int(results_page_size))
        else:
            limit_string = " limit 1000"

        return pg_select_rows_with_count("\
        select\
            count(*) over() as row_count,\
            e.id_event,\
            e.id_event_category,\
            e.name,\
            e.date_from,\
            e.date_to,\
            e.link,\
            ec.name as category,\
            coalesce(ec.id_event_category_parent, e.id_event_category) as id_event_category_parent\
        from\
            event e\
        left join\
            event_category ec on ec.id_event_category = e.id_event_category\
        where\
            (%(id_event)s is null or e.id_event = %(id_event)s)\
            and (%(name)s is null or %(name)s = '' or e.name ilike %(name)s)\
            and (%(id_event_category)s is null or e.id_event_category in (select\
                                                                            ec.id_event_category\
                                                                          from\
                                                                            event_category ec\
                                                                          where\
                                                                            ec.id_event_category = %(id_event_category)s\
                                                                            or ec.id_event_category_parent = %(id_event_category)s))\
            and (%(date_from)s is null or e.date_to >= %(date_from)s)\
            and (%(date_to)s is null or e.date_from < %(date_to)s::date + INTERVAL '1 day')\
        order by\
            e.date_from,\
            e.name\
        {0}".format(limit_string), 
        {
            "id_event": id_event,
            "id_event_category": id_event_category,
            "name": "%{0}%".format(name) if name != None and name != '' else None,
            "date_from": date_from,
            "date_to": date_to
        })

    @staticmethod
    def get_events(id_event = None,
                   id_event_category = None,
                   name = None,
                   date_from = None,
                   date_to=None,
                   sort_by = None,
                   results_page = None,
                   results_page_size = None):
        events = []

        rows, row_count = Event.db_select(
            id_event=id_event,
            id_event_category=id_event_category,
            name=name,
            date_from=date_from,
            date_to=date_to,
            sort_by=sort_by,
            results_page=results_page,
            results_page_size=results_page_size)

        for row in rows:
            event = Event()
            event.fill_from_data_row(row)
            events.append(event)

        return events, row_count
