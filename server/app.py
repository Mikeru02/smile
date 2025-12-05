from pathlib import Path
from flask import Flask, send_from_directory, redirect
from routes.v1.index import v1
from dotenv import load_dotenv
from modules.arduino.arduino import Arduino
import os

load_dotenv()

port = os.getenv("PORT", 80)
host = os.getenv("HOST", "0.0.0.0")
serial_port = os.getenv("SERIAL_PORT", "/dev/ttyACM0")
serial_speed = os.getenv("SERIAL_SPEED", 9600)
serial_timeout = os.getenv("SERIAL_TIMEOUT", 1)

arduino = Arduino(serial_port, serial_speed, serial_timeout)

directory = Path(__file__).resolve().parent.parent / "dist"

app = Flask(__name__, static_folder=None)

app.register_blueprint(v1, url_prefix="/v1")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=["GET","POST"])
def serve(path):
    file_path = directory / path

    if file_path.exists() and file_path.is_file():
        return send_from_directory(directory, path)

    return send_from_directory(directory, 'index.html')

@app.route('/generate_204')
@app.route('/hotspot-detect.html')
def captive_redirect():
    return redirect("/", code=302)
