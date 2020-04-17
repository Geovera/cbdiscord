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
    async def delete(url, cookies=None):
        req_url = API_URL_BASE + url
        response = requests.delete(req_url, cookies=cookies)

        return Api.status_code_handling(response)

    @staticmethod
    async def getSession(url, session):
        req_url = API_URL_BASE + url
        response = session.get(req_url)

        return Api.status_code_handling(response)

    @staticmethod
    async def postSession(url, data, session):
        req_url = API_URL_BASE + url
        response = session.post(req_url, json=data)
        return Api.status_code_handling(response)

    @staticmethod
    async def putSession(url, data, session):
        req_url = API_URL_BASE + url
        response = session.put(req_url, json=data)
        return Api.status_code_handling(response)

    @staticmethod
    async def deleteSession(url, session):
        req_url = API_URL_BASE + url
        response = session.delete(req_url)

        return Api.status_code_handling(response)


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