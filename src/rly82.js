const { EventEmitter } = require('events');
const SerialPort = require('serialport');
const player = require('play-sound')(opts = {})

//
// Commands
//

// Get digital inputs - returns a single byte reflecting all eight 
// inputs as digital state, All on = 255 (11111111) All off = 0
const GET_DIGITAL_INPUTS = 0x5E;

// Get serial number - returns 8 bytes of ASCII that form the unique 
// serial number for module, I.E "00001543"
const GET_SERIAL_NUMBER = 0x38;

// Get relay states - sends a single byte back to the controller, 
// bit high meaning the corresponding relay is powered
const GET_RELAY_STATES = 0x5B;

// Set relay states - the next single byte will set all relays states, 
// All on = 2 lowest bits set in byte (xxxxxx11) All off = 0
const SET_RELAY_STATES = 0x5C;

// Turn relay 1 on
const SET_RELAY_1 = 0x65;

// Turn relay 2 on
const SET_RELAY_2 = 0x66;

// Turn relay 1 off
const RESET_RELAY_1 = 0x6F;

// Turn relay 2 off
const RESET_RELAY_2 = 0x70;

// for more commands see: https://www.robot-electronics.co.uk/files/usb-rly82.pdf

//
// RLY handler
//
class RLY82 extends EventEmitter {
  constructor(portName) {
    super()
    this.portName = portName;
  }

  /**
   * Open connection
   */
  connect() {
    return new Promise((resolve, reject) => {
      // open serial (USB) port
      this.port = new SerialPort(this.portName, { baudRate: 9600})
      this.port.on('error', error => {
        reject(new Error('Failed to open serial port: ' + this.portName))
      })

      this.port.on('open', () => {
        // handle serial data input
        this.latestInputs = 0;
        this.port.on('data', buffer => {
          /* received data, emit inputs byte */
          const value = buffer[0]
          if (value !== this.latestInputs) {
            this.emit('inputs', value)
            this.latestInputs = value;
          }
        })
  
        // initially put all relays off
        this.port.write(Buffer.from([SET_RELAY_STATES, 0]));
        resolve()
      })
    })
  }

  /**
   * Disconnect and stop polling (if any)
   */
  disconnect() {
    this.stopPolling();
    if (this.port.isOpen) {
      this.port.close();
    }
  }

  /**
   * Start polling for input changes
   */
  startPolling(timeout) {
    this.timer = setInterval(() => {
      this.port.write(Buffer.from([GET_DIGITAL_INPUTS]));
    }, timeout || 500)
  }

  /**
   * Stop polling for input changes
   */
  stopPolling() {
    clearInterval(this.timer)
  }

  /**
   * Turn relay x on
   */
  turnRelayOn(relay) {
    this.port.write(Buffer.from([relay === 0 ? SET_RELAY_1: SET_RELAY_2]));
  }

  /**
   * Turn relay x off
   */
  turnRelayOff(relay) {
    this.port.write(Buffer.from([relay === 0 ? RESET_RELAY_1: RESET_RELAY_2]));
  }
}

module.exports = RLY82