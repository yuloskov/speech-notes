import urllib.request
from celery import Celery
import speech_recognition as sr
import os
import requests


SERVER_ADDRESS = os.environ['SERVER_ADDRESS'] if 'SERVER_ADDRESS' in os.environ else 'localhost'
SERVER_PORT = os.environ['SERVER_ADDRESS'] if 'SERVER_ADDRESS' in os.environ else '5000'
PROTOCOL = os.environ['PROTOCOL'] if 'PROTOCOL' in os.environ else 'http'
BROKER_URL = os.environ['BROKER_URL'] if 'BROKER_URL' in os.environ else 'amqp://localhost'


app = Celery('tasks', broker=BROKER_URL)
app.autodiscover_tasks()


@app.task(name='proceed_audio')
def proceed_audio(filename, callback_url):
    url = f'{PROTOCOL}://{SERVER_ADDRESS}:{SERVER_PORT}/{filename}'
    urllib.request.urlretrieve(url, filename)

    r = sr.Recognizer()
    audio_file = sr.AudioFile(filename)
    with audio_file as source:
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)
    text = r.recognize_sphinx(audio)

    os.remove(filename)

    url = f'{PROTOCOL}://{SERVER_ADDRESS}:{SERVER_PORT}/callback'
    pload = {'callback_url': callback_url, 'filename': filename, 'text': text}
    requests.post(url, json=pload)

    return text
