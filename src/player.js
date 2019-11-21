// http://soundbible.com/tags-mp3.html
var player = require('play-sound')(opts = { })

function playSound(file) {
  return new Promise((resolve, reject) => {
    const audio = player.play(file, {}, (err) => {
      if (err) {
        return reject('Failed to play: ' + file);
      }
      resolve();
    })  
  })
}


module.exports = playSound