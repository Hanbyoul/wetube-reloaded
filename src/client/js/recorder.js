const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  //a태그 생성

  a.href = videoFile;
  //a태그 소스에 videoFile 넣기

  a.download = "MyRecording.webm";
  // a태그를 download 속성으로 설정
  // 저장할때 자동으로 파일이름으로 설정됨.
  // 파일의 확장자도(비디오포맷) 설정 가능

  document.body.appendChild(a);
  // html-body에 해당 a태그를 자식으로 넣는다

  a.click();
  //a태그가 클릭된다 ( 다운로드가 자동으로 된다)
};

const handleStop = () => {
  startBtn.innerText = "Download Recording"; // 하나의 버튼으로
  startBtn.removeEventListener("click", handleStop); // 이벤트를 삭제
  startBtn.addEventListener("click", handleDownload); // 이벤트를 생성
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };

  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};
init();

startBtn.addEventListener("click", handleStart);
