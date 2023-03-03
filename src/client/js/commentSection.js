// 내가 현재 어떤 동영상에 있는지 알기위해 이전에 작업했던
// videoContainer(data-id=video._id) 를 사용하기 위해 불러온다
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

// comment를 백엔드에 보내기
const handleSubmit = (e) => {
  // text와video를 미리 선언하면 템플릿에서
  // if문 사용시 로그인 하지 않은 유저일 경우에 if문 아래에 있는 Element들이 선언이 되지 않아서
  // 함수 실행시 엘리먼트를 선언하는 형식으로 변경한다

  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; // 입력된 text의 내용을
  const videoId = videoContainer.dataset.id; // 백엔드에 전송 준비

  if (text === "") {
    return;
  }
  //videoPlay.js에서 백엔드로 보냇을 때 참조
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      //headers 는 Request에 추가 정보를 담을 수 있다.
      "Content-Type": "application/json", // Express에게 json을 보낸다고 명시 해줘야한다.
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
