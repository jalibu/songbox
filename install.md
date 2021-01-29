**Installation Guide**

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install nodejs
    sudo npm install --global grunt
    sudo npm install --global yarn
    yarn config set registry https://registry.npmjs.org/
    yarn global add grunt@1.0.2
    cd songbox-master/
    yarn install
    sudo apt-get install dnsmasq hostapd

sudo nano /etc/hostapd/hostapd.conf

    interface=wlan0
    ssid=Pfadi_Song_Box
    hw_mode=g
    channel=7
    auth_algs=1
    wmm_enabled=0

sudo nano /etc/default/hostapd

    DAEMON_CONF="/etc/hostapd/hostapd.conf"
    
sudo vi /etc/dhcpcd.conf (BOTTOM)

    interface wlan0
    static ip_address=192.168.1.1
    static routers=192.168.1.1
    static domain_name_servers=8.8.8.8
    
sudo nano /etc/dnsmasq.conf

    interface=wlan0
    domain-needed
    bogus-priv
    dhcp-range=192.168.1.8,192.168.1.250,12h

sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 172.0.0.1:8080