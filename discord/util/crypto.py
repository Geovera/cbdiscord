import os
from Crypto.Cipher import AES
from base64 import b64encode, b64decode
from settings import CRYPT_SALT
from settings import CRYPT_KEY
from settings import ENC_DEC_MEDTHOD

class Crypto:

    @staticmethod
    def encrypt(str_to_enc):
        try:
            aes_obj = AES.new(CRYPT_KEY, AES.MODE_CFB, CRYPT_SALT)
            hx_enc = aes_obj.encrypt(str_to_enc.encode('utf8'))
            mret = b64encode(hx_enc).decode(ENC_DEC_MEDTHOD)
            return mret
        except ValueError as value_error:
            if value_error.args[0] == 'IV must be 16 bytes long':
                raise ValueError('Encryption Error: SALT must be 16 characters long')
            elif value_error.args[0] == 'AES key must be either 16, 24, or 32 bytes long':
                raise ValueError('Encryption Error: Encryption key must be either 16, 24, or 32 characters long')
            else:
                raise ValueError(value_error)

    @staticmethod
    def decrypt(enc_str):
        try:
            aes_obj = AES.new(CRYPT_KEY.encode('utf8'), AES.MODE_CFB, CRYPT_SALT)
            str_tmp = b64decode(enc_str.encode(ENC_DEC_MEDTHOD))
            str_dec = aes_obj.decrypt(str_tmp)
            mret = str_dec.decode(ENC_DEC_MEDTHOD)
            return mret
        except ValueError as value_error:
            if value_error.args[0] == 'IV must be 16 bytes long':
                raise ValueError('Decryption Error: SALT must be 16 characters long')
            elif value_error.args[0] == 'AES key must be either 16, 24, or 32 bytes long':
                raise ValueError('Decryption Error: Encryption key must be either 16, 24, or 32 characters long')
            else:
                raise ValueError(value_error)