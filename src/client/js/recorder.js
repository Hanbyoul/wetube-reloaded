import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const Files = {
  input: "recording,webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);

  actionBtn.innerText = "파일을 변환중입니다...";

  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", Files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", Files.input, "-r", "60", Files.output);

  await ffmpeg.run(
    "-i",
    Files.input,
    "-ss", //추출을 시작할 위치
    "00:00:01",
    "-frames:v", //추출할 비디오 프레임 수
    "1",
    Files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", Files.output);
  const thumbFile = ffmpeg.FS("readFile", Files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");

  downloadFile(thumbUrl, "My Thumbnail.jpg");

  //가상에 생성된 파일 삭제
  ffmpeg.FS("unlink", Files.input);
  ffmpeg.FS("unlink", Files.output);
  ffmpeg.FS("unlink", Files.thumb);

  //브라우저 메모리에 유지되어 있는 URL 삭제
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  init();
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };

  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1025,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};
init();

actionBtn.addEventListener("click", handleStart);
