// http://soundbible.com/tags-mp3.html
const player = require('play-sound')(opts = { })

/**
 * Plays a sound
 */
module.exports.playSound = (file) => {
  return new Promise((resolve, reject) => {
    const audio = player.play(file, {}, (err) => {
      if (err) {
        return reject('Failed to play: ' + file);
      }
      resolve();
    })  
  })
}

/**
 * Wait for a number of ms
 */
module.exports.wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}

/**
 * Checks if the input is set
 */
module.exports.isInputHigh = (data, number) => {
  var mask = 1 << number - 1;
  return (data & mask) != 0;
}