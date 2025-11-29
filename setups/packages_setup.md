# Setting Up Core Packages

# Package Needed
* dnsmasq
* NetworkManager
* iptables
* conntrack-tools

# Procedures
### Step 1
Setup your `Orange Pi Zero 3`. Refer to this [setup](opi_setup.md) you don't have it yet.

### Step 2
Update the system
```bash
sudo apt update
sudo apt upgrade
```

### Step 3
Install the essential packages
``` bash
sudo apt install -y dnsmasq NetworkManager iptables conntrack-tools
```

### Step 4
Setup the `.conf` of dnsmasq and NetworkManager.
#### For `dnsmasq`
File path: `/etc/dnsmasq.conf`
Paste, add or rewrite the `dnsmasq.conf` into this.
``` bash
interface=enxec9a0c1bee94
bind-interfaces
domain-needed
bogus-priv
dhcp-range=192.168.10.10,192.168.10.100,12h
dhcp-option=3,192.168.10.1
dhcp-option=6,192.168.10.1
log-queries
log-dhcp

no-resolv
server=1.1.1.1
server=8.8.8.8
```
`Note`: To open the file just use `sudo nano /etc/dnsmasq.conf`
#### For `NetworkManager`
File path: `/etc/NetworkManager/NetworkManager.conf`
Paste, add or rewrite the `NetworkManager.conf` into this.
``` bash
[main]
dns=default
rc-manager=file
plugins=ifupdown,keyfile

[ifupdown]
managed=true

[device]
wifi.scan-rand-mac-address=no

[keyfile]
unmanaged-device=none
```
`Note`: To open the file just use `sudo nano /etc/NetworkManager/NetworkManager.conf`
