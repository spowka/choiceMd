from db import *
import datetime


class NewsfeedArticle(object):
    def __init__(self, id_article=None, db_row=None):
        id_article = str(id_article) if id_article != None else None
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_article != None:
            rows, _ = self.db_select(id_article=id_article)
            if len(rows) == 0:
                raise KeyError("row not found")
            self.fill_from_data_row(rows[0])

    def fill_from_data_row(self, row):
        self.id_article = row["id_article"]
        self.posting_datetime = row["posting_datetime"]
        self.archive_date = row["archive_date"]
        self.news_type = row["news_type"]
        self.headline = row["headline"]
        self.blurb = row["blurb"]
        self.byline = row["byline"]
        self.body = row["body"]
        self.feature_blurb = row["feature_blurb"]
        self.feature_image = row["feature_image"]
        self.attribution = row["attribution"]
        self.tagline = row["tagline"]
        self.source = row["source"]
        self.copyright = row["copyright"]
        self.topic = row["topic"]
        self.specialty = row["specialty"]

    def insert(self):
        self.id_article = pg_execute("\
        insert into newsfeed_article(\
            id_article,\
            posting_datetime,\
            archive_date,\
            news_type,\
            headline,\
            blurb,\
            byline,\
            body,\
            feature_blurb,\
            feature_image,\
            attribution,\
            tagline,\
            source,\
            copyright,\
            topic,\
            specialty)\
        values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id_article",
                                     (
                                         self.id_article,
                                         self.posting_datetime,
                                         self.archive_date,
                                         self.news_type,
                                         self.headline,
                                         self.blurb,
                                         self.byline,
                                         self.body,
                                         self.feature_blurb,
                                         self.feature_image,
                                         self.attribution,
                                         self.tagline,
                                         self.source,
                                         self.copyright,
                                         self.topic,
                                         self.specialty
                                     ))

    def update(self):
        pg_execute("\
        update\
            newsfeed_article\
        set\
            id_article = %s,\
            posting_datetime = %s,\
            archive_date = %s,\
            news_type = %s,\
            headline = %s,\
            blurb = %s,\
            byline = %s,\
            body = %s,\
            feature_blurb = %s,\
            feature_image = %s,\
            attribution = %s,\
            tagline = %s,\
            source = %s,\
            copyright = %s,\
            topic = %s,\
            specialty = %s\
        where\
            id_article = %s",
                   (
                       self.id_article,
                       self.posting_datetime,
                       self.archive_date,
                       self.news_type,
                       self.headline,
                       self.blurb,
                       self.byline,
                       self.body,
                       self.feature_blurb,
                       self.feature_image,
                       self.attribution,
                       self.tagline,
                       self.source,
                       self.copyright,
                       self.topic,
                       self.specialty,
                       self.id_article
                   ))

    def delete(self):
        pg_execute("\
        delete from\
            newsfeed_article\
        where\
            id_article = %s",
                   (
                       self.id_article,
                   ))

    def reload(self):
        rows, _ = self.db_select(id_article=self.id_article)
        self.fill_from_data_row(rows[0])

    @staticmethod
    def get_max_id():
        rows = pg_execute("""
            select max(cast(id_article as integer)) as 
                id_max 
            from newsfeed_article
        """, None)

        return rows

    @staticmethod
    def db_select(id_article=None,
                  sort_by=None,
                  name=None,
                  news_type=None,
                  results_page=None,
                  results_page_size=None,
                  filter_by=None):
        order_string = ""
        if sort_by:
            sort_by_sanitized = sort_by.replace("'", "").replace('"', '')
            order_string = " order by {0}".format(sort_by_sanitized)

        limit_string = ""
        if results_page and results_page_size:
            start_record = (results_page - 1) * results_page_size
            limit_string = " offset {0} limit {1}".format(
                int(start_record), int(results_page_size))

        filter_string = ""
        if filter_by and len(filter_by) > 0:
            for f in filter_by:
                filter_string += "and {0} ilike '{1}%%'".format(
                    f["id"], f["value"])

        return pg_select_rows_with_count("\
            select\
            count(*) over() as row_count,\
                id_article,\
                posting_datetime,\
                archive_date,\
                news_type,\
                headline,\
                blurb,\
                byline,\
                body,\
                feature_blurb,\
                feature_image,\
                attribution,\
                tagline,\
                source,\
                copyright,\
                topic,\
                specialty\
            from\
                newsfeed_article\
            where\
                (%(id_article)s is null or id_article = %(id_article)s)\
                and (%(headline)s is null or %(headline)s = '' or headline ilike %(headline)s)\
                and (%(news_type)s is null or %(news_type)s = '' or news_type ilike %(news_type)s)\
           {0} {1} {2}".format(filter_string, order_string, limit_string),
            {
                "id_article": id_article,
                "headline": "%{0}%".format(name) if name != None and name != '' else None,
                "news_type": "%{0}%".format(news_type) if news_type != None and news_type != '' else None
        })

    @staticmethod
    def insert_all(rows):
        query = """
            insert into newsfeed_article(
                id_article,
                posting_datetime,
                archive_date,
                news_type,
                headline,
                blurb,
                byline,
                body,
                feature_blurb,
                feature_image,
                attribution,
                tagline,
                source,
                copyright,
                topic,
                specialty
            ) values %s
        """

        pg_execute_all(query, rows)

    @staticmethod
    def get_article_by_id(id_article=None):

        query = "select * from newsfeed_article where id_article is null or id_article = %(id_article)s"

        return pg_select_rows(query, {
            "id_article": id_article
        })

    @staticmethod
    def get_articles(id_article=None, name=None, news_type=None, results_page=None, results_page_size=None):

        articles = []

        rows, row_count = NewsfeedArticle.db_select(
            name=name,
            news_type=news_type,
            results_page=results_page,
            results_page_size=results_page_size)

        for row in rows:
            article = NewsfeedArticle()
            article.fill_from_data_row(row)
            articles.append(article)

        return articles, row_count
