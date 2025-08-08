import os

class Path_Handler:
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))

    @staticmethod
    def get(filename):
        return os.path.join(Path_Handler.base_dir, filename)