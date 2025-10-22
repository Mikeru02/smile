from pathlib import Path
from flask import Flask, send_from_directory

directory = Path(__file__).resolve().parent.parent / "dist"

app = Flask(__name__, static_folder=None)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    file_path = directory / path

    if file_path.exists() and file_path.is_file():
        return send_from_directory(directory, path)

    return send_from_directory(directory, 'index.html')
