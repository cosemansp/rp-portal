const readline = require('readline');
const { EventEmitter } = require('events');

const isInput = (data, number) => {
  var mask = 1 << number - 1;
  return (data & mask) != 0;
}

const INPUT_DOOR_BELL = 1;
const INPUT_DOOR_CLOSED = 2;

class Dispatcher extends EventEmitter {
  constructor(rly82, player) {
    super();

    this.rly82 = rly82;
    this.player = player;
    rly82.startPolling(100);
    rly82.on('inputs', async (data) => {
      // console.log('>> inputs: ', data.toString(2));
      if (isInput(data, INPUT_DOOR_BELL)) {
        this.emit('bell');
      }
      else if (isInput(data, INPUT_DOOR_CLOSED)) {
        this.emit('door');
      }
      else {
        this.emit('inputs', data);
      }
    });

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        this.emit('quit');
        return;
      }
      this.emit('keypress', key);
    })
  }

  async openDoor() {
    console.log('open door')
    this.rly82.turnRelayOn(1);
    await this.wait(2000);
    this.rly82.turnRelayOff(1);
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    })
  }

  setTimer(ms, key) {
    this.timerId = setTimeout(() => {
      this.emit('timer', key);
    }, ms)
  }

  stopTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
  }

  dispose() {
    this.stopTimer();
    this.player.stop();
    this.rly82.disconnect();
  }
}

module.exports = Dispatcher;
