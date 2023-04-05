const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const fullScreenIcon = fullScreen.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  if (video.muted) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else if (!video.muted && volumeValue >= 0.5) {
    muteBtnIcon.classList = "fas fa-volume-up";
  } else if (!video.muted && volumeValue >= 0.1) {
    muteBtnIcon.classList = "fas fa-volume-down";
  }

  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (e) => {
  const {
    target: { value },
  } = e;

  video.volume = value;
  volumeValue = value;

  if (video.volume >= 0.5) {
    muteBtnIcon.classList = "fas fa-volume-up";
  } else if (video.volume >= 0.1) {
    muteBtnIcon.classList = "fas fa-volume-down";
  } else if (video.volume <= 2.7755575615628914e-17) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19);

const handleLoadedMetaData = () => {
  if (!isNaN(video.duration)) {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
  }
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const handleKeyEvent = (e) => {
  if (e.key === "Enter") {
    handleFullScreen();
  }
  if (e.key === "ArrowRight") {
    video.currentTime += 3;
  }
  if (e.key === "ArrowLeft") {
    video.currentTime -= 3;
  }
  if (e.key === " ") {
    e.preventDefault();
    handlePlayClick();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (video.volume < 0.99) {
      video.volume += 0.1;
      volumeRange.value = video.volume;
    }
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (video.volume > 0.1) {
      video.volume -= 0.1;
      volumeRange.value = video.volume;
    }
  }
  if (video.volume >= 0.5) {
    muteBtnIcon.classList = "fas fa-volume-up";
  } else if (video.volume >= 0.1) {
    muteBtnIcon.classList = "fas fa-volume-down";
  } else if (video.volume <= 2.7755575615628914e-17) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }

  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("canplay", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", () => video.focus());
video.addEventListener("keydown", (e) => {
  handleKeyEvent(e);
});

handleLoadedMetaData();
