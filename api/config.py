import os

DEBUG = True
POSTGRES_DATABASE_HOST = os.environ.get("POSTGRES_DATABASE_HOST", "test-choicemd.cvps0v8aayng.us-east-2.rds.amazonaws.com")
POSTGRES_DATABASE_USER = os.environ.get("POSTGRES_USER", "choicemd")
POSTGRES_DATABASE_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "choicemd123")
POSTGRES_DATABASE_DB = os.environ.get("POSTGRES_DATABASE", "choicemd_test")
MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = os.environ.get("MAIL_PORT", 465)
MAIL_USE_SSL = os.environ.get("MAIL_USE_SSL", True)
MAIL_USERNAME  = os.environ.get("MAIL_USERNAME", "perooo@gmail.com")
MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "mojasifra2")