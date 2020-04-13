import os
from dotenv import load_dotenv
load_dotenv()

DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
API_URL_BASE = os.getenv('API_URL_BASE')
CRYPT_SALT = os.getenv('CRYPT_SALT')
CRYPT_KEY = os.getenv('CRYPT_KEY')
ENC_DEC_MEDTHOD = os.getenv('ENC_DEC_MEDTHOD')