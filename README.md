# Raspberry-Pi Portal

## USB Module: USB-RLY82

Technical Documentation
https://www.robot-electronics.co.uk/files/usb-rly82.pdf


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

# list all serial ports (raspberrypi)
$ dmesg | grep tty
[    0.000000] Kernel command line: coherent_pool=1M 8250.nr_uarts=0 bcm2708_fb.fbwidth=656 bcm2708_fb.fbheight=416 bcm2708_fb.fbswap=1 vc_mem.mem_base=0x3ec00000 vc_mem.mem_size=0x40000000  console=ttyS0,115200 console=tty1 root=/dev/mmcblk0p7 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait quiet splash plymouth.ignore-serial-consoles
[    0.000302] console [tty1] enabled
[    0.729931] 3f201000.serial: ttyAMA0 at MMIO 0x3f201000 (irq = 81, base_baud = 0) is a PL011 rev2
[ 1631.157166] cdc_acm 1-1.1.2:1.0: ttyACM0: USB ACM device

export PORT_NAME=/dev/ttyACM0
```
