const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i"); //playBtn 안에 있는 icon을 선택
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i"); //muteBtn 안에 있는 icon을 선택
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const fullScreenIcon = fullScreen.querySelector("i"); //fullScreenBtn 안에 있는 icon을 선택
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5; //미디어의 초기값 , 이후 비디오의 볼륨값을 저장
video.volume = volumeValue;
let videoSetTime = false;
//미디어 플레이,스톱 설정
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleKeyPlay = (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    handlePlayClick();
  }
};

//미디어 볼륨 음소거 설정
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

  volumeRange.value = video.muted ? 0 : volumeValue; // 음소거를 취소하면 가장최근의 볼륨값으로 바뀐다
  console.log("뮤트 온오프 비디오", video.volume);
  console.log("뮤트 온오프 전역 ", volumeValue);
};

//미디어 볼륨 설정
const handleVolumeChange = (e) => {
  const {
    target: { value },
  } = e;

  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = false;
  }

  volumeValue = value; //볼륨을 올리거나,내릴때 항상 값이 저장된다 (최근값 저장용)
  video.volume = value; //미디어의 볼륨 조절( 사용자가 드래그한 벨류값으로)

  if (video.volume >= 0.5) {
    muteBtnIcon.classList = "fas fa-volume-up";
  } else if (video.volume >= 0.1) {
    muteBtnIcon.classList = "fas fa-volume-down";
  } else if (video.volume === 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
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

const handleKeySetOff = () => {
  videoSetTime = !videoSetTime;
};

const handleKeySetTime = (e) => {
  if (!videoSetTime) {
    if (e.key === "ArrowRight") {
      video.currentTime += 3;
    }
    if (e.key === "ArrowLeft") {
      video.currentTime -= 3;
    }
  }
};

//미디어이
const handleFullScreen = () => {
  //영상뿐만 아니라 컨트롤러 부분도 다 full 스크린으로 해야되기 때문에
  //템플릿에서 전체를 감싸는 Container를 만들어서 적용시킨다.
  const fullscreen = document.fullscreenElement; //full screen 확인
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const handleKeyFullScreen = (e) => {
  if (e.key === "Enter") {
    handleFullScreen();
  }
};

//timeout이 끝나면 showing class를 제거한다
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  //미디어 안으로 마우스가 들어오면 MouseLeave의 timeout 중단되고, timeout의 값이 초기화 된다.
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  // 미디어 안에서 마우스의 움직임을 감지할때마다 timeout이 중단>초기화>시작 이 반복 된다
  // 미디어 안에서 마우스의 움직임을 멈추면 timeout은 중단되지 않는다.
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  //videoControls class 목록에서 showing 이라는 class가 생성된다.
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  //마우스가 미디어 밖으로 나갈경우 timeout이 실행된다.
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
volumeRange.addEventListener("focusin", handleKeySetOff);
volumeRange.addEventListener("focusout", handleKeySetOff);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick);
document.addEventListener("keydown", (e) => handleKeyPlay(e));
document.addEventListener("keydown", (e) => handleKeySetTime(e));
document.addEventListener("keydown", (e) => handleKeyFullScreen(e));
