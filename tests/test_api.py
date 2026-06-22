import sys
import pathlib
import os
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

os.environ['ALLOWED_HOSTS'] = '*'

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealth:
    def test_get_health_returns_200(self):
        response = client.get('/api/health')
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'ok'


class TestCiphers:
    def test_get_ciphers_returns_list(self):
        response = client.get('/api/ciphers')
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_k4_returns_cipher(self):
        response = client.get('/api/ciphers/k4')
        assert response.status_code == 200
        data = response.json()
        assert data['id'] == 'k4'

    def test_get_nonexistent_returns_404(self):
        response = client.get('/api/ciphers/nonexistent')
        assert response.status_code == 404


class TestDecrypt:
    def test_vigenere_with_key_returns_decrypted_text(self):
        response = client.post('/api/decrypt/vigenere', json={
            'ciphertext': 'EMUFPH',
            'key': 'PALIMPSEST',
        })
        assert response.status_code == 200
        data = response.json()
        assert 'plaintext' in data
        assert isinstance(data['plaintext'], str)


class TestAnalyze:
    def test_frequencies_with_ciphertext(self):
        response = client.post('/api/analyze/frequencies', json={
            'ciphertext': 'HELLO WORLD',
            'cipher': {},
        })
        assert response.status_code == 200
        data = response.json()
        assert 'frequencies' in data
        assert 'ioc' in data
        assert len(data['frequencies']) == 26
