import os
import secrets
from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_restful import Resource, Api
from worker.celery import app as celery_app

from celery import Celery
celery = Celery('tasks')
celery_app = Celery(broker='amqp://localhost')

flask_app = Flask(__name__, static_url_path='')
api = Api(flask_app)

STORAGE_FOLDER = "storage"
flask_app.config['STORAGE_FOLDER'] = STORAGE_FOLDER

ALLOWED_EXTENSIONS = {'flac', 'wav'}


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
            celery_app.send_task('proceed_audio',
                                 kwargs={'filename': upd_filename,
                                         'callback_url': request.form['callback_url']})
            return jsonify({"status": "ok"})

        return jsonify({"status": "error", "error_msg": "Unsupported file extension"})


class FileServe(Resource):
    def get(self, path):
        return send_from_directory(flask_app.config['STORAGE_FOLDER'], path)


class Status(Resource):
    def get(self):
        return jsonify({"status": "ok"})


api.add_resource(FileReceive, '/')
api.add_resource(FileServe, '/<path>')
api.add_resource(Status, '/status')


if __name__ == '__main__':
    flask_app.run(debug=True)
