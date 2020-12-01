import urllib.request

from celery import Celery

app = Celery('tasks', broker='amqp://localhost')
app.autodiscover_tasks()

SERVER_ADDRESS = 'localhost'
SERVER_PORT = '5000'
PROTOCOL = 'http'

@app.task(name='proceed_audio')
def proceed_audio(filename, callback_url):
    url = f'{PROTOCOL}://{SERVER_ADDRESS}:{SERVER_PORT}/{filename}'
    urllib.request.urlretrieve(url, filename)

    return None
