import os

class Path_Handler:
    base_dir = os.path.dirname(__name__)

    @staticmethod
    def get(filename):
        return os.path.join(Path_Handler.base_dir, filename)