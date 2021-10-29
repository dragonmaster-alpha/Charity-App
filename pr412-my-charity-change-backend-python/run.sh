#!/bin/env bash

# Init
flask db upgrade

# Run server
gunicorn --workers 3 --preload --timeout 600 --bind 0.0.0.0:5000 runserver:app