import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const removeBtn = document.querySelectorAll(".removeBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  //❗️❗️❗️
  //백엔드에서 보낸 json형식의 코멘트의id를
  //프론트엔드에서 json 형식으로 받아서
  // dataset.id 에 넣는다
  // newComment.dataset.id = id;
  //❗️❗️❗️
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  const span2 = document.createElement("span");
  span2.dataset.id = id;
  span2.className = "removeBtn";
  span2.innerText = "❌";

  span2.addEventListener("click", (e) => handleRemove(e));

  videoComments.prepend(newComment); // ul 태그안에 <재일 먼저> li 태그를 넣음
  newComment.appendChild(icon); // li 태그 안에 <재일 마지막에>icon을 넣음
  newComment.appendChild(span); // li 태그 안에 <재일 마지막에>span을 넣음
  newComment.appendChild(span2); // li 태그 안에 <재일 마지막에>span을 넣음
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json(); //백엔드에서 json형식으로 response 한 data를 받을수있다.
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

//자식 엘리먼트 이벤트리스너 만들기

const handleRemove = async (e) => {
  // console.log("클릭");
  // console.log(e.target.dataset.id);
  // console.log(e.target);
  // console.log(e);
  const {
    target: {
      dataset: { id },
    },
  } = e;

  console.log("코멘트 아이디", id);

  await fetch(`/api/comment/${id}/remove`, {
    method: "DELETE",
  });
};

removeBtn.forEach((i) => {
  i.addEventListener("click", (e) => handleRemove(e));
});

//1)삭제버튼
//2)수정버튼
//3)좋아요버튼
//4)댓글 갯수 UI

// 삭제 delete 참조
// 댓글의 주인만 버튼이 보인다   ---HTML에서 사용자확인
// 해당 댓글의 commentId로 DELETE
// router 생성하여 DELETE메소드 전송
// 백엔드에서 DELETE 전송할때 사용자가 맞는지 ---백엔드에서 사용자확인
// User, Video DB에서도 연동되게 지워야함
// 삭제후 status 코드를 받고 이를기반으로
// Element를 삭제하는 함수를 만들어 실행한다.

// 수정 edit참조
// 댓글의 주인만 버튼이 보인다
// 해당 댓글의 commentId로 text를 수정하여 POST

// 좋아요
// 로그인한 유저만 버튼이 보인다
// 로그인한 유저가 (작성자 포함) 해당 코멘트에 1회 좋아요가능 ,취소가능
// db에 유저id를 조회해서 없을 경우 좋아요 + 가능 true
// db에 유저id를 조회해서 있을 경우 좋아요 - 가능 false
// db에 true인 유저(좋아요 누른)의 length값으로 좋아요 갯수 추출 가능.
// 개똒똒한데 한별이?ㅎㅎ
