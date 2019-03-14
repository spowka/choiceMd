from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from random import randint
from db import *
from model.user_role import *

class User(object):

    def __init__(self, id_user=None, email=None, auth_provider=None, db_row=None):
        self.date_activated = None		
        self.role = ""
        
        if db_row != None:
            self.fill_from_data_row(db_row)
        elif id_user != None:
            rows, _ = self.db_select(id_user=id_user)
            if len(rows) == 0:
                raise KeyError("user not found")
            self.fill_from_data_row(rows[0])
        elif auth_provider != None:
            rows, _ = self.db_select(email=email, auth_provider=auth_provider)
            if len(rows) == 0:
                raise KeyError("user not found")
            self.fill_from_data_row(rows[0])
        elif email != None:
            rows, _ = self.db_select(email=email)
            if len(rows) == 0:
                raise KeyError("user not found")
            self.fill_from_data_row(rows[0])

    def fill_from_data_row(self, row):
        self.id_user = row["id_member"]
        self.id_user_role = row["id_member_role"]
        self.email = row["email"]
        self.name = row["name"]
        self.password = row["password"]
        self.is_activated = row["is_activated"]
        self.date_activated = row["date_activated"]
        self.auth_provider = row["auth_provider"]        
        self.password_reset_code = row["password_reset_code"]
        self.activation_code = row["activation_code"]
        self.role = row["role"]        

    def insert(self):        
        uid = str(uuid.uuid4())

        self.id_user = pg_execute("insert into member(id_member_role,\
													   email,\
													   name,\
													   auth_provider,\
													   password,\
													   is_activated,\
													   date_activated,\
                                                       activation_code\
                                                       )\
									values(%s, %s, %s, %s, %s, %s, %s, %s) returning id_member", 
                                    (self.id_user_role,
                                    self.email,
                                    self.name,                                    
                                    self.auth_provider,                                    
                                    self.password,
                                    self.is_activated,                                    
                                    self.date_activated,
                                    uid
                                    ))

    def update(self):
        pg_execute("update\
						member\
					set\
						id_member_role = %s,\
						email = %s,\
						name = %s,\
						password = %s,\
						is_activated = %s,\
						date_activated = %s,\
                        password_reset_code = %s,\
                        activation_code = %s\
					where\
						id_member = %s",
                        (self.id_user_role,
                        self.email,
                        self.name,                        
                        self.password,	                        
                        self.is_activated,
                        self.date_activated,
                        self.password_reset_code,
                        self.activation_code,
                        self.id_user))

    def delete(self):        
        pg_execute("delete from oauth_token where id_member = %s", (self.id_user, ))
        pg_execute("delete from member where id_member = %s", (self.id_user, ))
        
    def reload(self):
        rows, _ = self.db_select(id_user=self.id_user)
        self.fill_from_data_row(rows[0])

    def is_valid_password(self, password):
        return check_password_hash(self.password, password)

    def get_is_admin(self):
        return int(UserRole.is_admin(self.id_user_role))

    is_admin = property(get_is_admin)

    @staticmethod
    def get_users(id_user=None, name=None, email=None, auth_provider=None, sort_by=None, results_page=None, results_page_size=None):
        rows, rows_count = User.db_select(id_user=id_user, name=name, sort_by=sort_by, results_page=results_page, results_page_size=results_page_size)
        users = []
        for row in rows:
            u = User(db_row=row)
            users.append(u)
        return users, rows_count

    @staticmethod
    def db_select(id_user=None, name=None, email=None, auth_provider=None, sort_by=None, results_page=None, results_page_size=None):
        order_string = ""

        if sort_by:
            sort_by_sanitized = sort_by.replace("'", "").replace('"', '')
            order_string += " ORDER BY {0}".format(sort_by_sanitized) 

        limit_string = ""

        if results_page and results_page_size:
            start_record = (results_page - 1) * results_page_size
            limit_string = " LIMIT {0} OFFSET {1}".format(int(results_page_size), start_record)

        rows, rows_count = pg_select_rows_with_count("select\
                                                        count(*) over() as row_count,\
                                                        m.id_member,\
                                                        m.id_member_role,\
                                                        m.email,\
                                                        m.name,\
                                                        m.password,\
                                                        m.is_activated,\
                                                        m.date_activated,\
                                                        m.auth_provider,\
                                                        m.password_reset_code,\
                                                        m.activation_code,\
                                                        mr.Name as role\
                                                    from\
                                                        member m\
                                                    left join\
                                                        member_role mr on mr.id_member_role = m.id_member_role\
                                                    where\
                                                        (%(id_member)s is null or m.id_member = %(id_member)s)\
                                                        and (%(email)s is null or m.email = %(email)s)\
                                                        and (%(auth_provider)s is null or m.auth_provider = %(auth_provider)s)\
                                                        and (%(name)s is null or %(name)s = '' or m.name ilike %(name)s or m.email ilike %(name)s)\
                                                    {0} {1}".format(order_string, limit_string), {"id_member": id_user, 
                                                                                                   "email": email,
                                                                                                   "auth_provider": auth_provider,
                                                                                                   "name": "%{0}%".format(name) if name != None and name != '' else None})

        return rows, rows_count

    @staticmethod
    def check_exists(email, id_user_ignore=None):
        if id_user_ignore:
            rows =  pg_select_rows("select count(*) as user_count from member where email = %s and id_member <> %s", (email, id_user_ignore))
        else:
            rows =  pg_select_rows("select count(*) as user_count from member where email = %s", (email, ))

        if rows[0]["user_count"] > 0:
            return True

        return False

    @staticmethod
    def encrypt_password(password):
        return generate_password_hash(password)

    @staticmethod
    def activate(email, activation_code):
        rows =  pg_select_rows("select id_member from member where email = %s and activation_code = %s", (email, activation_code))
        
        if len(rows) == 0:
            return None

        id_user = rows[0]["id_member"]
        pg_execute("update member set is_activated=1, activation_code='' where id_member = %s", (id_user, ))
        
        return User(id_user=id_user)