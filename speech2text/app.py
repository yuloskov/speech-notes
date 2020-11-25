from flask import Flask
app = Flask(__name__)

STORAGE_DIR = "storage"

@app.route('/')
def receive_file():
    return 'Ok'

@app.route('/status')
def status():
    return 'Ok'
