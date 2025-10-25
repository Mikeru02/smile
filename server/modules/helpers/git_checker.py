import subprocess

class GIT:
    @staticmethod
    def fetch():
        try:
            result = subprocess.run(
                ["git", "fetch"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return result
        except Exception as error:
            print("Unexpected error: ", error)
    
    @staticmethod
    def pull():
        try:
            result = subprocess.run(
                ["git", "pull"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return result
        except Exception as error:
            print("Unexpected error: ", error)

        