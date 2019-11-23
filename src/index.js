const RLY82 = require('./rly82');
const { wait, isInput } = require('./utils');
const SoundPlayer = require('./player');
const Dispatcher = require('./dispatcher');
const player = new SoundPlayer();

// Door sequence
/* 
  >> deur bel (input 1), when door is closed
    - start timer 10 sec (see later)
    - relay 1 - open door (voor 2 sec)
    - audio 1 ('hello, goededag, kom binnen, ...')
  >> 10sec timer
    - audio 2 (boos: 'he laat jij de deur ook open staan ...')
  >> deur sluit (input 2)
    - stop audio 1, audio 2 
    - timer stop
    - audio ('merci')
    - re-enable doorbel
*/

(async function run() {
  //
  // Start app
  // 
  console.log('Portal App Started');

  try {
    //
    // Connect RLY82
    //
    const portName = process.env.PORT_NAME || '/dev/ttyACM0' /* raspberry-pi device name */
    const rly82 = new RLY82(portName);
    console.log('Connect RLY82')
    await rly82.connect();

    //
    // Process events
    // 
    const dispatcher = new Dispatcher(rly82, player);
    let toggle = 0;
    let doorOpen = false;
    dispatcher.on('bell', async (data) => {
      console.log('doorBell');   
      if (doorOpen) return;
      try {
        await dispatcher.openDoor();   
        doorOpen = true;
        await dispatcher.player.playOnce('./sounds/welcome.mp3') 
        dispatcher.setTimer(2000, 'tooLongOpen');
      }
      catch(err) {
        // aborted
        console.log(err);
      }
    });

    dispatcher.on('door', async (data) => {
      console.log('doorClosed', doorOpen);
      if (!doorOpen) return;
      try {
        dispatcher.stopTimer();
        await dispatcher.player.stop();
        await dispatcher.player.playOnce('./sounds/thankyou.mp3')     
        doorOpen = false;
      } 
      catch(err) {
        // aborted
        console.log(err);
      }
    });

    dispatcher.on('timer', async (key) => {
      try {
        if (key === 'tooLongOpen') {
          await dispatcher.player.playRepeat('./sounds/angry.mp3', 3)
        }
      }
      catch(err) {
        // aborted
        console.log(err);
      }
    })

    dispatcher.on('quit', async (key) => {
      console.log('CTRL-C, quitting...')
      dispatcher.dispose();
      process.exit(); 
    });

    // dispatcher.on('keypress', async (key) => {
    //   console.log('toggle relay 1: ', toggle)
    //   if (!toggle) {
    //     toggle = 1;
    //     dispatcher.rly82.turnRelayOn(1)
    //   }
    //   else {
    //     toggle = 0;
    //     dispatcher.rly82.turnRelayOff(1)
    //   } 
    // })

  }
  catch(err) {
    console.log('Error: ', err.message);
    process.exit(1)
  }
})()



