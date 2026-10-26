from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

KEY = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(KEY)

def encrypt_data(plain_text: str):
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, plain_text.encode('utf-8'), None)
    return {"nonce": nonce, "ciphertext": ciphertext}

def decrypt_data(nonce: bytes, ciphertext: bytes):
    decrypted_text = aesgcm.decrypt(nonce, ciphertext, None)
    return decrypted_text.decode('utf-8')