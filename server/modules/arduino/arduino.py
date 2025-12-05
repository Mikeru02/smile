import serial
import time

class Arduino:
    def __init__(self, serial_port, serial_speed, serial_timeout) -> None:
        self.serial_port = serial_port
        self.serial_speed = serial_speed
        self.serial_timeout = serial_timeout

        self.serial_connection = serial.Serial(
            port=self.serial_port,
            baudrate=self.serial_speed,
            timeout=self.serial_timeout
        )

        time.sleep(3)

    def send_message(self, message):
        self.serial_connection.write(message)

    def read_message(self):
        line = self.serial_connection.readline().decode('utf-8').strip()
        return line
    
    