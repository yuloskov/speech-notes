import os
import secrets
from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_restful import Resource, Api
import requests
from celery import Celery


BROKER_URL = os.environ['BROKER_URL'] if 'BROKER_URL' in os.environ else 'amqp://localhost'
MIDDLEWARE_PORT = int(os.environ['MIDDLEWARE_PORT']) if 'MIDDLEWARE_PORT' in os.environ else 5000
STORAGE_FOLDER = os.environ['STORAGE_FOLDER'] if 'STORAGE_FOLDER' in os.environ else "storage"
ALLOWED_EXTENSIONS = {'flac', 'wav'}


celery_app = Celery(broker=BROKER_URL)


flask_app = Flask(__name__, static_url_path='')
flask_app.config['STORAGE_FOLDER'] = STORAGE_FOLDER
api = Api(flask_app)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def update_filename(filename):
    name, *extensions = filename.split('.')
    new_name = secrets.token_hex(64)
    return ".".join([new_name] + extensions)


class FileReceive(Resource):
    def post(self):
        if 'audio_file' not in request.files:
            return jsonify({"status": "error", "error_msg": "No file part"})

        file = request.files['audio_file']

        if file.filename == '':
            return jsonify({"status": "error", "error_msg": "No file was sent"})

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upd_filename = update_filename(filename)
            file.save(os.path.join(flask_app.config['STORAGE_FOLDER'], upd_filename))

            celery_app.send_task(
                'process_audio',
                 kwargs={
                     'filename': upd_filename,
                     'callback_url': request.form['callback_url'],
                     'auth_token': request.form['auth_token'],
                 },
            )

            return jsonify({"status": "ok"})

        return jsonify({"status": "error", "error_msg": "Unsupported file extension"})


class FileServe(Resource):
    def get(self, path):
        return send_from_directory(flask_app.config['STORAGE_FOLDER'], path)


class Callback(Resource):
    def post(self):
        content = request.json

        os.remove(flask_app.config['STORAGE_FOLDER'] + "/" + content['filename'])

        pload = {
            'success': True,
            'text': content['text'],
            'auth_token': content['auth_token'],
        }
        requests.post(content['callback_url'], json=pload)

        return jsonify({'status': 'ok'})


class Status(Resource):
    def get(self):
        return jsonify({"status": "ok"})


api.add_resource(FileReceive, '/')
api.add_resource(FileServe, '/<path>')
api.add_resource(Status, '/status')
api.add_resource(Callback, '/callback')


if __name__ == '__main__':
    flask_app.run(host='0.0.0.0', port=MIDDLEWARE_PORT)
