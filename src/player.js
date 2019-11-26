// http://soundbible.com/tags-mp3.html
const APlay = require('aplay');
const { EventEmitter } = require('events');

class SoundPlayer extends EventEmitter {
  constructor() {
    super();
    this.audio = null;
    this.stopped = false;
    this.sound = new APlay();
    this.sound.on('complete', () => {
      console.log('completed')
    })
    this.sound.on('stop', () => {
      console.log('stopped')
    })
    this.sound.on('pause', () => {
      console.log('paused')
    })
  }

  play(file) {
    console.log('player.play: ', file)
    this.sound.play(file);
  }

  stop() {
    console.log('player.stop')
    this.sound.stop();
  }
}

module.exports = SoundPlayer;