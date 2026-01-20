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
unmanaged-device=interface-name:enx*
```
`Note`: To open the file just use `sudo nano /etc/NetworkManager/NetworkManager.conf`. This build uses systemd to avoid reindexing of the interfaces

### For `Network Service`
File path: `/etc/network/interfaces`
Paste or add this line to the config of the network service
``` bash
    # Uplink interface (DHCP from router)
    auto enxec9a0c164fda # Change the interface name base on your interface name
    iface enxec9a0c164fda inet dhcp

    # USB-LAN interface to TP-Link AP (static IP)
    auto enxec9a0c1bee94 # Change the interface name base on your interface name
    iface enxec9a0c1bee94 inet static
        address 192.168.10.1
        netmask 255.255.255.0
```

### For `IPTables`
Configure the iptables in the terminal whether it is a `root` or a `user`.
``` bash
    # Flush old rules
    iptables -F FORWARD
    iptables -t nat -F PREROUTING
    iptables -t nat -F POSTROUTING
    conntrack -D -s 192.168.10.0/24
    conntrack -D -d 192.168.10.0/24

    # enable forwarding
    sysctl -w net.ipv4.ip_forward=1

    # default deny forwarding
    iptables -P FORWARD DROP

    # portal hijack (only for non-allowed clients)
    iptables -t nat -A PREROUTING -i enxec9a0c1bee94 -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:80
    iptables -t nat -A PREROUTING -i enxec9a0c1bee94 -p udp --dport 53 -j DNAT --to-destination 192.168.10.1

    # allow portal itself
    iptables -A FORWARD -d 192.168.10.1 -j ACCEPT
    iptables -A FORWARD -s 192.168.10.1 -m state --state ESTABLISHED,RELATED -j ACCEPT
```