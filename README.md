# Raspberry-Pi Portal

## Setup Rasberian

### NOOBS (to install Raspbian OS)

* [Download NOOBS for Raspberry Pi](https://www.raspberrypi.org/downloads/noobs/)

### Install NodeJS
* [Install Node.js and Npm on Raspberry Pi: 5 Steps](https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/)
* [Raspberry Pi + NodeJS | We Work We Play](https://weworkweplay.com/play/raspberry-pi-nodejs/)

### Make it run on boot

```bash
# install pm2
$ sudo npm install -g pm2

# start the app
$ cd ./git/portal
$ pm2 start ./src/index.js

# Generate startup script
$ pm2 startup systemd

# Copy the generated command and run it
$ sudo env PATH=$PATH:/usr/bin /usr/l....

# Create dump file
$ pm2 save
```

### Basic config

```bash
# open configiration
$ sudo raspi-config
```

Extra information
* https://dev.to/bogdaaamn/run-your-nodejs-application-on-a-headless-raspberry-pi-4jnn

## USB Module: USB-RLY82

Technical Documentation
https://www.robot-electronics.co.uk/files/usb-rly82.pdf

Mac Address: `b8:27:eb:45:3e:51`

## Serial Port

How to find serial port on MacOS

```bash
# list all serial ports (macOS)
$ ls /dev/tty.*
/dev/tty.Bluetooth-Incoming-Port /dev/tty.usbmodem10009051

# first disable serial port for login
# https://www.instructables.com/id/Read-and-write-from-serial-port-with-Raspberry-Pi/
$ sudo raspi-config
# interface options - P6 Serial - No: Login - Yes: enable serial
```

List all serial ports (raspberrypi)

```
$ dmesg | grep tty
[    0.000000] Kernel command line: coherent_pool=1M 8250.nr_uarts=0 bcm2708_fb.fbwidth=656 bcm2708_fb.fbheight=416 bcm2708_fb.fbswap=1 vc_mem.mem_base=0x3ec00000 vc_mem.mem_size=0x40000000  console=ttyS0,115200 console=tty1 root=/dev/mmcblk0p7 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait quiet splash plymouth.ignore-serial-consoles
[    0.000302] console [tty1] enabled
[    0.729931] 3f201000.serial: ttyAMA0 at MMIO 0x3f201000 (irq = 81, base_baud = 0) is a PL011 rev2
[ 1631.157166] cdc_acm 1-1.1.2:1.0: ttyACM0: USB ACM device

export PORT_NAME=/dev/ttyACM0
```

## Connect from PC to Raspberry Pi

```bash
# open terminal 

# test connection (wifi or ethernet)
$ ping raspberrypi.local

# open ssh (password: root)
$ ssh pi@raspberrypi.local
Warning: Permanently added the ECDSA host key for IP address 'fe80::29b9:5a71:19d4:c8ca%en5' to the list of known hosts.
pi@raspberrypi.local password: ***** 

# check if program is running (online)
$ pm2 list

# restart raspberry pi
$ sudo reboot
```

## Edit source 

```bash
# goto app folder
cd ~/git/portal

# open editor (ctrl-o: save, ctrl-x: exit)
# for example to change timers
nano ./src/index.js

# restart app
pm2 restart 0
```

## Get new version from github 

Make sure you have internet connection

```bash
# goto app folder
cd ~/git/portal

# get latest version (passphrase: silverado)
git pull

# you can now restart the app
node ./src/index.js
```

## Aplay (audio player)

```bash
# list all audio devices
$ aplay -l

# volume control
$ alsamixer
```

