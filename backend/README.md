# UpSkill
A web based application to assist students with learning organization and planning.
_Agile Software Projects_

# Backend
This folder contains all backend services written using python3, fastapi and sqlite3.

## Prerequisites
- python 3.8.13 or higher
- poetry (pip install poetry)
- sqlite3 (command must be in PATH to build DB.)
- permissions to run


## Useful Commands
`poetry install`
`poetry run invoke clean` # erase existing DB
`poetry run invoke build` # install DB from template.
`poetry run invoke start` # start backend services

## Running Tests
`poetry run invoke test`

## Viewing API Documentation
After starting the backend services, you are able to navigate API documentation by visiting  http://127.0.0.1:8000/docs.
