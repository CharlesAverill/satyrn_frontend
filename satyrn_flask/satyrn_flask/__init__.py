import os, random, string

from flask import Flask, send_from_directory, render_template, request

from .interpreter import Interpreter

def new_name():
    letters_and_digits = string.ascii_letters + string.digits
    result_str = ''.join((random.choice(letters_and_digits) for i in range(16)))
    return result_str

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/style.css")
    def syle_css():
        return render_template("style.css")

    @app.route("/script.js")
    def script_js():
        return render_template("script.js")

    @app.route("/create_cell/", methods=["GET"])
    def create_cell():
        name = new_name()
        return name
    return app

