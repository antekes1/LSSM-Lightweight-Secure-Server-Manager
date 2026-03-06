import os
from dotenv import load_dotenv
load_dotenv()

algorithm = str(os.getenv("ALGORITM"))
secret_key_token = str(os.getenv("SECRET_KEY"))
password_email = str(os.getenv("PASSWORD_EMAIL"))
smtp_server_email = str(os.getenv("SMTP_SERVER_EMAIL"))
stage = str(os.getenv("STAGE"))
app_version = str(os.getenv("APP_VERSION"))

telegram_bot_api = str(os.getenv("TELEGRAM_BOT_TOKEN"))
chat_id = str(os.getenv("CHAT_ID"))
discord_webhook_url = str(os.getenv("DISCORD_WEBHOOK_URL"))

DBHOST = os.getenv("DBHOST")
DBNAME = os.getenv("DBNAME")
DBUSER = os.getenv("DBUSER")
DBPASS = os.getenv("DBPASS")

# if os.getenv("URL_DATABASE"):
#     url_database = os.getenv("URL_DATABASE")
# else:
#     url_database = (
#         # f"postgresql://{DBUSER}:{DBPASS}@{DBHOST}:5432/{DBNAME}?sslmode=require"
#         f"postgresql://{DBUSER}:{DBPASS}@{DBHOST}:5432/{DBNAME}"
#     )

# paths
url_database = "sqlite:///./lssm.db"
log_dir = "./logs/"
archived_log_dir = "./logs_archive/"

class static_vars():
    MAX_ACTIVE_LOG_LINES = 150
    ARCHIVE_RETENTION_DAYS = 14