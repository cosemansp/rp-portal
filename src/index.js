const readline = require('readline');
const RLY82 = require('./rly82');
const { playSound, wait, isInputHigh } = require('./utils');

(async function run() {
  //
  // Start app
  // 
  console.log('Portal App Started');

  try {
    //
    // Connect RLY82
    //
    const portName = process.env.PORT_NAME || '/dev/tty.usbmodem10009051'
    const rly82 = new RLY82(portName);
    console.log('Connect RLY82')
    await rly82.connect();

    //
    // Start polling
    //
    rly82.startPolling(100);
    rly82.on('inputs', async (data) => {
      console.log('>> inputs: ', data.toString(2));
      if (isInputHigh(data, 1)) {
        await runCatOnToilet(rly82);
      }
    });

    //
    // Handle keyboard input
    //
    console.log('Press 1, 2 or ctrl-c')
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
      console.log('>> key pressed: ', key.name);
      if (key.ctrl && key.name === 'c') {
        console.log('CTRL-C, quitting...')
        rly82.disconnect();
        process.exit(); 
      } 
      if (key.name === '1') {
        console.log('  Set relay 1 on')
        rly82.turnRelayOn(1)
      }
      if (key.name === '2') {
        console.log('  Set relay 1 off')
        rly82.turnRelayOff(1)
      }
    });
  }
  catch(err) {
    console.log('Error: ', error);
    process.exit(1)
  }
})()

// Cat sequence
async function runCatOnToilet(rly82) {
  console.log('runCatOnToilet');
  try {
    console.log('  play cat...');
    await playSound('./sounds/cat.mp3')

    rly82.turnRelayOn(1)
    console.log('  wait 0.5 sec...');
    await wait(500);

    console.log('  play toilet...');
    await playSound('./sounds/toilet.mp3')

    rly82.turnRelayOff(1)
    console.log('  done');
  }
  catch(err) {
    console.log('Failed:', err)
  }
}



