# Raspberry-Pi Portal

## USB Module: USB-RLY82

Technical Documentation
https://www.robot-electronics.co.uk/files/usb-rly82.pdf


## Serial Port

How to find serial port on MacOS

```bash
# list all serial ports 
$ ls /dev/tty.*
/dev/tty.Bluetooth-Incoming-Port /dev/tty.usbmodem10009051

# read from serial port 
screen /dev/tty.usbmodem10009051 9600
```
