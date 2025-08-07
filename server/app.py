# Main Script Application for S.M.I.L.E.

from flask import Flask
from config.config import config as global_config
from utils.modules.file_handler import Open_File
from routes.v1.index import v1

app = Flask(__name__)
app.register_blueprint(v1, url_prefix='/v1')

config_file = Open_File("server/smile.conf")


if __name__ == '__main__':
    global_config = config_file.execute()
    app.run(host=global_config["HOST"], port=global_config["PORT"])