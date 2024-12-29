<script setup lang="ts">
const nowplaying = document.querySelector('#now-playing');

const trackart = document.querySelector('#track-art');
const trackname = document.querySelector('#track-name');
const tracknameMobile = document.querySelector('#track-name-mobile');

const playbtn = document.querySelector('#play');
const rewindbtn = document.querySelector('#rewind');
const fforwardbtn = document.querySelector('#fforward');

const playhead_input = document.querySelector('#playhead-input');
const playhead_display = document.querySelector('#playhead-display');

const currtime = document.querySelector('#current-time');
const duration = document.querySelector('#duration');

const volume_input = document.querySelector('#volume-input');
const volume_display = document.querySelector('#volume-display');
const mute = document.querySelector('#mute');

const trackbtnlist = Array.from(document.querySelectorAll('.song'));
const playbtnlist = Array.from(document.querySelectorAll('.bi-play'));

let tracknum: number = 0;
let playing: boolean = false;
let seekTimer;
let muted = false;

const loadTrack = (tracknum) => {
  let name;
  let image;
  let path;

  if (tracknum > -1) {
    name = tracklist[tracknum].name;
    image = tracklist[tracknum].image;
    path = tracklist[tracknum].path;
  }
  else {
    name = '---';
    image = '../assets/images/album placeholder.png';
    path = '';
  }

  clearInterval(seekTimer);
  resetValues();

  nowplaying.setAttribute('src', path);
  nowplaying.load();

  trackart.setAttribute('src', image);
  trackname.textContent = name;
  tracknameMobile.textContent = name;

  seekTimer = setInterval(seekUpdate, 1000);

  nowplaying.addEventListener('ended', nextTrack);
}

const resetValues = () => {
  currtime.textContent = '--:--';
  duration.textContent = '--:--';
  playhead_input.value = 0;
  playhead_display.setAttribute('style', 'width: 0%;');
}

const playPauseTrack = () => {
  if (!playing)
    playTrack();
  else
    pauseTrack();
}

const playTrack = () => {
  nowplaying.play();
  playing = true;

  playbtn.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');

  resetTrackBtns();
  trackbtnlist[tracknum].classList.add('playing');
  playbtnlist[tracknum].classList.replace('bi-play', 'bi-pause-circle');
  playbtnlist[tracknum].classList.replace('bi-play-circle', 'bi-pause-circle');
}

const pauseTrack = () => {
  nowplaying.pause();
  playing = false;

  playbtn.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
  playbtnlist[tracknum].classList.replace('bi-pause-circle', 'bi-play-circle');
}

const nextTrack = () => {
  if (tracknum < tracklist.length - 1)
    tracknum++;
  else
    tracknum = 0;

  loadTrack(tracknum);
  playTrack();
}

const prevTrack = () => {
  if (tracknum > 0)
    tracknum--;
  else
    tracknum = tracklist.length - 1;

  loadTrack(tracknum);
  playTrack();
}

const seekTo = () => {
  const seekto = nowplaying.duration * (playhead_input.value / 100);
  nowplaying.currentTime = seekto;
}

const seekUpdate = () => {
  let seekPosition = 0;

  if (!isNaN(nowplaying.duration)) {
    seekPosition = nowplaying.currentTime * (100 / nowplaying.duration);
    playhead_input.value = seekPosition;
    playhead_display.setAttribute('style', `width: ${seekPosition}%`);
    playhead_display.setAttribute('aria-valuenow', `${seekPosition}`);

    let currentMinutes = Math.floor(nowplaying.currentTime / 60);
    let currentSeconds = Math.floor(nowplaying.currentTime - currentMinutes * 60);

    let durationMinutes = Math.floor(nowplaying.duration / 60);
    let durationSeconds = Math.floor(nowplaying.duration - durationMinutes * 60);

    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;
    if (currentMinutes < 10) currentMinutes = '0' + currentMinutes;
    if (durationMinutes < 10) durationMinutes = '0' + durationMinutes;

    currtime.textContent = `${currentMinutes}:${currentSeconds}`;
    duration.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

const resetTrackBtns = () => {
  trackbtnlist.forEach((btn) => {
    btn.classList.remove('playing');
  });

  playbtnlist.forEach((btn) => {
    btn.classList.replace('bi-pause-circle', 'bi-play');
    btn.classList.replace('bi-play-circle', 'bi-play');
  });
}

playhead_input.addEventListener('change', (e) => {
  const percent = (e.target.value / playhead_input.getAttribute('max')) * 100;

  playhead_display.setAttribute('style', `width: ${percent}%`);
  playhead_display.setAttribute('aria-valuenow', `${percent}`);

  seekTo();
});

volume_input.addEventListener('input', (e) => {
  const percent = (e.target.value / volume_input.getAttribute('max')) * 100;

  volume_display.setAttribute('style', `width: ${percent}%`);
  volume_display.setAttribute('aria-valuenow', `${percent}`);

  nowplaying.volume = percent / 100;
});

mute.addEventListener('click', (e) => {
  if (muted) {
    volume_display.setAttribute('style', 'width: 100%');
    volume_display.setAttribute('aria-valuenow', '100');
    nowplaying.volume = 1;
    mute.classList.replace('bi-volume-mute', 'bi-volume-up');
    muted = false;
  }
  else {
    volume_display.setAttribute('style', 'width: 0%');
    volume_display.setAttribute('aria-valuenow', '0');
    nowplaying.volume = 0;
    mute.classList.replace('bi-volume-up', 'bi-volume-mute');
    muted = true;
  }
})

playbtn.addEventListener('click', () => {
  playPauseTrack();
});

rewindbtn.addEventListener('click', () => {
  prevTrack();
});

fforwardbtn.addEventListener('click', () => {
  nextTrack();
});

trackbtnlist.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const this_tracknum = parseInt(btn.getAttribute('data-tracknum'));
    const playpausebtn = btn.querySelector(':scope > .col-2 > i');

    // console.log(`tracknum: ${tracknum}`);
    // console.log(`this_tracknum: ${this_tracknum}`);

    if (this_tracknum === tracknum && playing) {
      pauseTrack();
      // playpausebtn.classList.replace('bi-pause-circle', 'bi-play');
    }
    else if (this_tracknum === tracknum && !playing) {
      playTrack();
      // playpausebtn.classList.replace('bi-play', 'bi-pause-circle');
    }
    else {
      tracknum = this_tracknum;
      loadTrack(tracknum);
      playTrack();
      // playpausebtn.classList.replace('bi-play', 'bi-pause-circle');
      // btn.classList.add('playing');
    }
  });
});

loadTrack(tracknum);
</script>

<!----------------------------------------------------------------------------->

<template>
  <div class="container py-3">

    <audio id="now-playing"></audio>

    <div class="row px-0 px-lg-3 align-items-center">

      <!-- Album art and track name -->
      <div class="col-3">
        <div class="container">
          <div class="row p-0 justify-content-start align-items-center">

            <!-- Album art -->
            <div class="col-12 col-lg-3 p-0">
              <img id="track-art" src="">
            </div> <!-- col -->

            <!-- Track name for desktop -->
            <div class="col-6 color-main d-none d-lg-block">
              <span id="track-name" class="track-name">---</span>
            </div> <!-- col -->

          </div> <!-- row -->
        </div> <!-- container -->
      </div> <!-- col -->

      <div class="col-9 col-lg-6">
        <div class="container">
          <div class="row p-0">

            <!-- Transport controls -->
            <div class="col-12 p-0">

              <!-- Play, rewind, fast forward-->
              <div class="container">
                <div class="row">

                  <!-- Rewind -->
                  <div
                    class="col-3 col-lg-5 px-2 text-center text-lg-end color-main">
                    <i id="rewind" class="bi-rewind control"></i>
                  </div> <!-- col -->

                  <!-- Play -->
                  <div class="col-3 col-lg-2 px-2 text-center color-main">
                    <i id="play" class="bi-play-circle-fill control"></i>
                  </div> <!-- col -->

                  <!-- Fast forward -->
                  <div
                    class="col-3 col-lg-5 px-2 text-center text-lg-start color-main">
                    <i id="fforward" class="bi-fast-forward control"></i>
                  </div> <!-- col -->

                  <!-- Volume icon for mobile -->
                  <div class="col-3 px-2 color-main text-center d-lg-none">
                    <i id="mute" class="bi-volume-up control"></i>
                  </div> <!-- col -->

                </div> <!-- row -->

                <!-- Playhead and duration -->
                <div class="row align-items-center">

                  <!-- Current time -->
                  <div class="col-2 px-2 text-end color-main d-none d-lg-block">
                    <span id="current-time">--:--</span>
                  </div> <!-- col -->

                  <!-- Playhead -->
                  <div class="col-12 col-lg-8 px-2 my-2 position-relative">
                    <input id="playhead-input" name="playhead" type="range"
                      max="100" value="0"
                      class="form-range position-absolute start-0 end-0">
                    <div class="progress position-relative">
                      <div id="playhead-display" class="progress-bar bg-accent"
                        role="progressbar" aria-valuenow="0" aria-valuemin="0"
                        aria-valuemax="100" style="width: 0%;"></div>
                    </div> <!-- progress -->
                  </div> <!-- col -->

                  <!-- Track duration -->
                  <div
                    class="col-2 px-2 text-start color-main d-none d-lg-block">
                    <span id="duration">--:--</span>
                  </div> <!-- col -->

                </div> <!-- row -->
              </div> <!-- container -->
            </div> <!-- col -->

          </div> <!-- row -->
        </div> <!-- container -->

        <!-- Track name for mobile -->
        <div class="container d-lg-none">
          <div class="row pt-1">
            <div id="track-name-mobile" class="col-12 text-center track-name">
              ---
            </div> <!-- col -->
          </div> <!-- row -->
        </div> <!-- container -->

      </div> <!-- col -->

      <!-- Volume control for desktop -->
      <div class="col-3 p-0 d-none d-lg-block">
        <div class="container">
          <div class="row justify-content-end align-items-center">

            <!-- Volume slider -->
            <div class="col-7 p-2 d-none d-lg-block position-relative">
              <input id="volume-input" name="volume" type="range" max="100"
                value="100" class="form-range position-absolute start-0 end-0">
              <div class="progress position-relative">
                <div id="volume-display" class="progress-bar bg-accent"
                  role="progressbar" aria-valuenow="100" aria-valuemin="0"
                  aria-valuemax="100" style="width: 100%"></div>
              </div> <!-- progress -->
            </div> <!-- col -->

            <!-- Volume icon -->
            <div class="col-12 col-lg-2 p-2 color-main text-end">
              <i class="bi-volume-up"></i>
            </div> <!-- col -->

          </div> <!-- row -->
        </div> <!-- container -->
      </div> <!-- col -->

    </div> <!-- row -->

  </div> <!-- container -->
</template>

<!----------------------------------------------------------------------------->

<style lang="scss" scoped>
:root {
  /* Colors */
  --input-accent: var(--accent-bg-color);
  --input-primary: #fff;

  --thumb-size: 1rem;
  --track-size: 0.5rem;
  --track-bg-color: transparent;
}

/* Base thumb styles */
.form-range::-webkit-slider-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  margin-top: -0.25rem;
  background-color: var(--input-primary);
  border: 0;
  border-radius: 1rem;
  /* -webkit-transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; */
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.form-range::-moz-range-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  background-color: var(--input-primary);
  border: 0;
  border-radius: 1rem;
  /* -moz-transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; */
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}

/* Thumb active */
.form-range::-webkit-slider-thumb:active {
  background-color: var(--input-accent);
}

.form-range::-moz-range-thumb:active {
  background-color: var(--input-accent);
}

/* Thumb focused */
.form-range:focus::-webkit-slider-thumb {
  box-shadow: none;
}

.form-range:focus::-moz-range-thumb {
  box-shadow: none;
}

/* Track styles */
.form-range::-webkit-slider-runnable-track {
  width: 100%;
  height: var(--track-size);
  color: transparent;
  cursor: pointer;
  background-color: var(--track-bg-color);
  border: none;
  border-radius: 1rem;
}

.form-range::-moz-range-track {
  width: 100%;
  height: var(--track-size);
  color: transparent;
  cursor: pointer;
  background-color: var(--track-bg-color);
  border: none;
  border-radius: 1rem;
}
</style>
