import json
import requests

from util.crypto import Crypto
from settings import API_URL_BASE

class ApiError(Exception):
    def __init__(self, error_code:int, message:str=None):
        self.error_code = error_code
        self.message = message

    def __str__(self):
        if self.message:
            return 'ApiError, {0} '.format(self.message)
        else:
            return 'ApiError has been raised'

class Api:

    @staticmethod
    async def get(url, cookies=None):
        req_url = API_URL_BASE + url
        response = requests.get(req_url, cookies=cookies)

        return Api.status_code_handling(response)

    @staticmethod
    async def post(url, data, cookies=None):
        req_url = API_URL_BASE + url
        response = requests.post(req_url, json=data, cookies=cookies)

        return Api.status_code_handling(response)

    @staticmethod
    async def put(url, data, cookies=None):
        req_url = API_URL_BASE + url
        response = requests.put(req_url, json=data, cookies=cookies)

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
        return await Api.post(url, data, cookies)

    @staticmethod
    async def putWithUser(url, data, uid):
        enc_id = Crypto.encrypt(str(uid))
        cookies = {'discord_id': enc_id}
        print('ENC: ' + enc_id)
        return await Api.put(url, data, cookies)


    @staticmethod
    def status_code_handling(response):
        content = response.content.decode('utf-8');
        if response.status_code >= 500:
            error_str = '[!] [{0}] Server Error'.format(response.status_code)
            print(error_str)
            raise ApiError(response.status_code, content)
        elif response.status_code == 404:
            error_str = '[!] [{0}] URL not found'.format(response.status_code)
            print(error_str)
            raise ApiError(response.status_code, content)
        elif response.status_code == 401:
            error_str = '[!] [{0}] Authentication Failed'.format(response.status_code);
            print(error_str)
            raise ApiError(response.status_code, content)
        elif response.status_code >= 400:
            error_str = '[!] [{0}] Bad Request'.format(response.status_code);
            print(error_str)
            print(content)
            raise ApiError(response.status_code, content)
        elif response.status_code >= 300:
            error_str = '[!] [{0}] Unexpected redirect.'.format(response.status_code)
            print(error_str)
            raise ApiError(response.status_code, content)
        elif response.status_code == 204:
            return True
        elif response.status_code == 200:
            return json.loads(response.content.decode('utf-8'))
        else:
            error_str = '[?] Unexpected Error: [HTTP {0}]: Content: {1}'.format(response.status_code, response.content)
            print(error_str)
            raise ApiError(response.status_code, content)