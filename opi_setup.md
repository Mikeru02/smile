# Setting Up The Orange Pi Zero 3

# Hardware needed
* Orange Pi Zero 3
* CP2102 module (UART TTL)
* SD Card Reader
* SD Card (Preferred 64GB)
* Ethernet Cable
* Jumper wires (Female to Female)

# Software needed
* balenaEtcher
* SD Card Formatter
* Minitool Partition Wizard
* Linux File System for Windows by Paragon Software
* PuTTY
* CP210x_Universal_Windows_Driver

# Procedures
### Step 1
Download the official ubuntu image for orange pi zero 3, you can download it [here](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/service-and-support/Orange-Pi-Zero-3.html). For this setup we used the `Orangepizero3_1.0.4_ubuntu_jammy_server_linux6.1.31.7z`.
Download the needed software to avoid delays.

### Step 2
Extract the `Orangepizero3_1.0.4_ubuntu_jammy_server_linux6.1.31.7z` using `7Zip` or `WinRAR`.

### Step 3
Put the `SD Card` to the `SD Card Reader` and plug it to your computer. Format the `SD Card` using the `SD Car Formmatter`.

### Step 4
Run the `balenaEcther` as administrator. Flash the extracted `disc image` into the `SD Card`

### Step 5
Run the `Linux File System for Windows by Paragon Software`. It will automatically be mounted on your `file explorer` and its name is `opi_root`.

### Step 6
Open the `opi_root` and click the `boot` folder. Inside the folder you will see `OrangepiEnv.txt` and open it. Modify it's content by this:
``` env
verbosity=7
bootlogo=false
console=serial
disp_mode=1920x1080p60
overlay_prefix=sun50i-h616
overlays=uart0
extraargs=console=ttyS0,115200
rootdev=UUID=2a44ed57-6df2-44b4-9d51-99000c47e55b
rootfstype=ext4
```
With this file, the board will be able to communicate with us using the `CP20102 moodule`.

### Step 7
Connect the `CP2102 module` to board's `UART` pins. The `UART` pin is a 3-grouped pin that is easily distinguishable. To connect, using `jumper wires`, female to female. The wiring should look like this.
``` txt
CP2102 module             Orange Pi Zero 3 UART Pins
    GND         -->                 GND
    RXD         -->                 TX
    TXD         -->                 RX
```

### Step 8
Plug the `CP2102 module` to your computer and open `PuTTY` and choose `Serial` and type the `COM Port`. To find the `COM Port`, open the window's `device manager` and find the `Ports (COM & LPT)`. You should see `Silicon Labs CP210x USB to UART Bridge (COM3)`. The COM is dependent on your computer
it can be COM6 or COM9. After finding the COM and typing it on the `PuTTY`, add a speed `115200`.

### Step 9
Plug the `Orange Pin Zero 3` board with `type-c` power connector. Wait for it to boot up.
