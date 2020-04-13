import json
import requests

from util.crypto import Crypto
from settings import API_URL_BASE

class Api:

    @staticmethod
    async def get(url, cookies=None):
        req_url = API_URL_BASE + url
        response = requests.get(req_url, cookies=cookies)

        return Api.status_code_handling(response)

    @staticmethod
    async def post(url, data, cookies=None):
        req_url = API_URL_BASE + url
        response = requests.get(req_url, json=data, cookies=cookies)

        return Api.status_code_handling(response)

    @staticmethod
    async def getWithUser(url, uid):
        enc_id = Crypto.encrypt(str(uid))
        cookies = {'discord_id': enc_id}
        print('ENC: ' + enc_id)
        return await Api.get(url, cookies)

    @staticmethod
    async def postWithUser(url, data, uid):
        enc_id = Crypto.encrypt(str(uid))
        cookies = {'discord_id': enc_id}
        print('ENC: ' + enc_id)
        return await Api.get(url, data, cookies)


    @staticmethod
    def status_code_handling(response):
        if response.status_code >= 500:
            print('[!] [{0}] Server Error'.format(response.status_code))
            return None
        elif response.status_code == 404:
            print('[!] [{0}] URL not found'.format(response.status_code))
            return None
        elif response.status_code == 401:
            print('[!] [{0}] Authentication Failed'.format(response.status_code))
            return None
        elif response.status_code >= 400:
            print('[!] [{0}] Bad Request'.format(response.status_code))
            print(response.content )
            return None
        elif response.status_code >= 300:
            print('[!] [{0}] Unexpected redirect.'.format(response.status_code))
            return None
        elif response.status_code == 200:
            return json.loads(response.content.decode('utf-8'))
        else:
            print('[?] Unexpected Error: [HTTP {0}]: Content: {1}'.format(response.status_code, response.content))
            return None