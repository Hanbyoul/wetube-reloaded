const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let volumeValue = 0.5; //미디어의 초기값 , 이후 비디오의 볼륨값을 저장
video.volume = volumeValue;

//미디어 플레이,스톱 설정
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

//미디어 볼륨 음소거 설정
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue; // 음소거를 취소하면 가장최근의 볼륨값으로 바뀐다
};

//미디어 볼륨 설정
const handleVolumeChange = (e) => {
  const {
    target: { value },
  } = e;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  volumeValue = value; //볼륨을 올리거나,내릴때 항상 값이 저장된다 (최근값 저장용)
  video.volume = value; //미디어의 볼륨 조절( 사용자가 드래그한 벨류값으로)
};

//미디어의 영상 시간 추출값을 변환
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19);

//미디어의 전체시간 추출
const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

//미디어의 실시간 추출
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

//미디어의 영상시간 설정
const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value; //미디어의 실시간 조절 ( 사용자가 드래그한 벨류값으로)
};

//미디어이
const handleFullScreen = () => {
  //영상뿐만 아니라 컨트롤러 부분도 다 full 스크린으로 해야되기 때문에
  //템플릿에서 전체를 감싸는 Container를 만들어서 적용시킨다.
  const fullscreen = document.fullscreenElement; //full screen 확인
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
};

const handleMouseMove = () => {
  //videoControls(비디오)에 마우스가 들어가면 감지하여
  //videoControls class 목록에서 showing 이라는 class가 생성된다.
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null; // 취소된 이후 새로 TimeOut ID를 받아야 하기 때문에 null로 초기화 시킨다
  }
  videoControls.classList.add("showing");
};

const handleMouseLeave = () => {
  //videoControls(비디오)에 마우스가 나가는것을 감지하여
  //videoControls class 목록에서 showing 이라는 class를 제거한다.
  controlsTimeout = setTimeout(() => {
    videoControls.classList.remove("showing");
  }, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
