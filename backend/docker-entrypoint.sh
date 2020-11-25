#!/usr/bin/env bash

set -e

cd /app

echo "Waiting for database to start..."
while !</dev/tcp/$DJANGO_DATABASE_HOST/$DJANGO_DATABASE_PORT; do
  sleep 1
done
echo "done"
echo

echo "Making database migrations..."
python manage.py makemigrations
echo "done"
echo

echo "Applying database migrations..."
python manage.py migrate
echo "done"
echo

python manage.py runserver 0.0.0.0:8000

exec "$@"