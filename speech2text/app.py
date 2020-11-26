import os
import secrets
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

app = Flask(__name__)

STORAGE_FOLDER = "storage"
app.config['STORAGE_FOLDER'] = STORAGE_FOLDER

ALLOWED_EXTENSIONS = {'flac', 'wav'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def update_filename(filename):
    name, *extensions = filename.split('.')
    new_name = secrets.token_hex(64)
    return ".".join([new_name] + extensions)


@app.route('/', methods=['POST'])
def receive_file():
    if 'audio_file' not in request.files:
        return jsonify({"status": "error", "error_msg": "No file part"})

    file = request.files['audio_file']

    if file.filename == '':
        return jsonify({"status": "error", "error_msg": "No file was sent"})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upd_filename = update_filename(filename)
        file.save(os.path.join(app.config['STORAGE_FOLDER'], upd_filename))
        return jsonify({"status": "ok"})

    return jsonify({"status": "error", "error_msg": "Unsupported file extension"})


@app.route('/status')
def status():
    return jsonify({"status": "ok"})
