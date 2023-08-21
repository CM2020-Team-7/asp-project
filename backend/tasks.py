import os
import sys

from invoke import task

sys.path.append(os.getcwd())


@task
def test(c):
    c.run('pytest -xra .')


@task
def build(c):
    c.run('cat ./db/db_schema.sql | sqlite3 ./db/database.db')


@task
def clean(c):
    c.run('rm -f ./db/database.db')


@task
def start(c):
    c.run('poetry run uvicorn main:app --reload')
