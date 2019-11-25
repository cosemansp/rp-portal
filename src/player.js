// http://soundbible.com/tags-mp3.html
const rawPlayer = require('play-sound')(opts = { })
const { EventEmitter } = require('events');

class SoundPlayer extends EventEmitter {
  constructor() {
    super();
    this.audio = null;
    this.stopped = false;
  }

  async play(file) {
    await this._play(file);
  }

  playRepeat(file, times) {
    let promise = Promise.resolve();
    while (times-- > 0) promise = promise.then(function () {
      return this._play(file);
    }.bind(this));
    return promise;
  }

  stop() {
    console.log('stop playback')
    if (!this.audio) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.stopped = true;
      
      // stop playback
      this.audio.kill();
      this.audio = null;

      // wait until  playback is finished
      this.on('playBackEnd', () => {
        this.stopped = false;
        resolve()
      })
    })
  }

  _play(file) {
    return new Promise((resolve, reject) => {
      console.log('start playback: ', file)
      this.audio = rawPlayer.play(file, {}, (err) => {
        console.log('stop playback', err, this.stopped)
        if (err) {
          return reject('Failed to play: ' + file);
        }
        if (this.stopped) {
          this.emit('playBackEnd');
          reject('playback aborted')
          return;
        }
        resolve(this.audio);
        this.audio = null;
      })  
    })
  }
}

module.exports = SoundPlayer;