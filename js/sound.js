var VOLUME = 0.2 //(ranges between 0 to 1)

/* Cache of Audio elements, for instant playback */
var cache = {}

var sounds = {
  ADD: {
    url: './assets/sounds/add.wav',
    volume: VOLUME
  },
  DELETE: {
    url: './assets/sounds/delete.wav',
    volume: VOLUME
  },
  DISABLE: {
    url: './assets/sounds/disable.wav',
    volume: VOLUME
  },
  DONE: {
    url: './assets/sounds/done.wav',
    volume: VOLUME
  },
  ENABLE: {
    url: './assets/sounds/enable.wav',
    volume: VOLUME
  },
  ERROR: {
    url: './assets/sounds/error.wav',
    volume: VOLUME
  },
  PLAY: {
    url: './assets/sounds/play.wav',
    volume: VOLUME
  },
  SEND: {
    url: './assets/sounds/send.wav',
    volume: VOLUME * 2
  },
  BELL: {
    url: './assets/sounds/bell.wav',
    volume: VOLUME * 5
  },
  STARTUP: {
    url: './assets/sounds/startup.wav',
    volume: VOLUME * 5
  }

}


function preloadSounds() {
  for (var name in sounds) {
    if (!cache[name]) {
      var sound = sounds[name]
      var audio = cache[name] = new window.Audio()
      audio.volume = sound.volume
      audio.src = sound.url
    }
  }
}

function playNotificationSound(name) {
  var audio = cache[name]
  if (!audio) {
    var sound = sounds[name]
    if (!sound) {
      throw new Error('Invalid sound name')
    }
    audio = cache[name] = new window.Audio()
    audio.volume = sound.volume
    audio.src = sound.url
  }
  audio.currentTime = 0
  audio.play()
}

preloadSounds();

