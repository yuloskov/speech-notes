import urllib.request
from celery import Celery
import speech_recognition as sr


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

    ans = r.recognize_sphinx(audio)

    return ans
