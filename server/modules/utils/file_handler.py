from .command import Command

class Open_File(Command):
    def __init__(self, file_path: str) -> None:
        self.__file_path = file_path
        self.__configuration = {}
    
    def get_configuration(self) -> dict:
        return self.__configuration
    
    def execute(self):
        with open(self.__file_path) as file:
            for line in file:
                if line.strip() == "" or line.strip().startswith("#"):
                    continue
                
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    self.__configuration[key.strip()] = value.strip()

        return self.get_configuration()