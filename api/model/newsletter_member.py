from db import *
import datetime


class NewsletterMember(object):

    def __init__(self, id_newsletter_member=None, db_row=None):
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_newsletter_member != None:
            rows, _ = self.db_select(id_newsletter_member=id_newsletter_member)
            if len(rows) == 0:
                raise KeyError("row not found")
            self.fill_from_data_row(rows[0])

    def fill_from_data_row(self, row):
        self.id_newsletter_member = row["id_newsletter_member"]
        self.email = row["email"]

    def insert(self):
        self.id_newsletter_member = pg_execute("\
        insert into newsletter_member(email)\
        values(%(email)s) returning id_newsletter_member", 
        {
            "email": self.email
        })

    @staticmethod
    def db_select(id_newsletter_member=None, email=None):
        return pg_select_rows("\
        select\
            nm.id_newsletter_member,\
            nm.email\
        from\
            newsletter_member nm\
        where\
            (%(id_newsletter_member)s is null or nm.id_newsletter_member = %(id_newsletter_member)s)\
            and (%(email)s is null or nm.email = %(email)s)",
        {
            "id_newsletter_member": id_newsletter_member,
            "email": email
        })

    @staticmethod
    def get_member(id_newsletter_member=None,
                   email=None):

        rows = NewsletterMember.db_select(
                id_newsletter_member=id_newsletter_member,
                email=email)

        if len(rows) > 1:
            raise KeyError("multiple rows found")

        if len(rows) == 0:
            return None

        return NewsletterMember(db_row=rows[0])
