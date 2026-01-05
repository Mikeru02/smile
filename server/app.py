from pathlib import Path
from flask import Flask, send_from_directory, redirect, make_response
from routes.v1.index import v1
from dotenv import load_dotenv

directory = Path(__file__).resolve().parent.parent / "dist"

app = Flask(__name__, static_folder=None)

app.register_blueprint(v1, url_prefix="/v1")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=["GET","POST"])
def serve(path):
    file_path = directory / path

    if file_path.exists() and file_path.is_file():
        response = make_response(send_from_directory(directory, path))
        response.status_code = 302
        return response

    return send_from_directory(directory, 'index.html')

@app.route('/generate_204')
@app.route('/hotspot-detect.html')
def captive_redirect():
    return redirect("/", code=302)
