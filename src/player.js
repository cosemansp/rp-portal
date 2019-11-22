// http://soundbible.com/tags-mp3.html
const rawPlayer = require('play-sound')(opts = { })


class SoundPlayer {
  constructor() {
    this.audio = null;
    this.stopped = false;
  }

  async playOnce(file) {
    this.stop();
    this.stopped = false;
    await this._play(file);
  }

  playRepeat(file, times) {
    this.stoppedRepeat = false;
    let promise = Promise.resolve();
    while (times-- > 0 && !this.stoppedRepeat) promise = promise.then(function () {
      if (!this.stoppedRepeat) {
        return this._play(file);
      }
    }.bind(this));
    return promise;
  }

  stopRepeat() {
    this.stop();
    this.stoppedRepeat = true;
  }

  stop() {
    if (this.audio) {
      this.audio.kill();
      this.audio = null;
    }
    this.stopped = true;
  }

  _play(file) {
    return new Promise((resolve, reject) => {
      this.audio = rawPlayer.play(file, {}, (err) => {
        if (err) {
          console.log('error playback', err);
          return reject('Failed to play: ' + file);
        }
        resolve(this.audio);
      })  
    })
  }
}

module.exports = SoundPlayer;