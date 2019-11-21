const readline = require('readline');
const RLY82 = require('./rly82');
const playSound = require('./player');

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}

//
// Start app
// 
console.log('Portal App Started');


//
// Connect RLY82
//
const portName = process.env.PORT_NAME || '/dev/tty.usbmodem10009051'
const rly82 = new RLY82(portName);
rly82.connect();

// Start polling
rly82.startPolling(100);
rly82.on('inputs', async (data) => {
  console.log('inputs', data);
  if (data === 1) {
    console.log('start sequence')
    try {
      console.log('  play toilet...');
      await playSound('./src/toilet.mp3')

      rly82.turnRelayOn(1)
      console.log('  wait 0.5 sec...');
      await wait(500);

      console.log('  play cat...');
      await playSound('./src/cat.mp3')

      rly82.turnRelayOff(1)
      console.log('  done');
    }
    catch(err) {
      console.log('Failed:', err)
    }
  }
});

// Handle keyboard input
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    console.log('CTRL-C pressed, quitting...')
    rly82.disconnect();
    process.exit(); 
  } 
  if (str === '1') {
    rly82.turnRelayOn(1)
  }
  if (str === '2') {
    rly82.turnRelayOff(1)
  }
});



