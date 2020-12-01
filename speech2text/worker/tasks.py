import urllib.request
from celery import Celery
import speech_recognition as sr
import os
import requests


app = Celery('tasks', broker='amqp://localhost')
app.autodiscover_tasks()

SERVER_ADDRESS = 'localhost'
SERVER_PORT = '5000'
PROTOCOL = 'http'

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
