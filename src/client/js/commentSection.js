import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const removeBtn = document.querySelectorAll(".removeBtn");
const editBtn = document.querySelectorAll(".editBtn");
const commentDate = document.querySelectorAll(".video__comment ._date");
const likeBtn = document.querySelectorAll(".video__comment_like");
let action = false;

const addComment = (text, id, name) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  //❗️❗️❗️
  //백엔드에서 보낸 json형식의 코멘트의id를
  //프론트엔드에서 json 형식으로 받아서
  // dataset.id 에 넣는다
  newComment.dataset.id = id;
  //❗️❗️❗️
  newComment.className = "video__comment";
  const scripDiv = document.createElement("div");
  const btnDiv = document.createElement("div");
  const scripIcon = document.createElement("i");
  const editIcon = document.createElement("i");
  const trashIcon = document.createElement("i");
  const nullSpan = document.createElement("span");
  const scripSpan = document.createElement("span");
  const removeSpan = document.createElement("span");
  const editSpan = document.createElement("span");

  scripIcon.className = "fas fa-comment";
  editIcon.className = "fas fa-edit";
  trashIcon.className = "fas fa-trash-alt";
  scripSpan.className = "video__comment__scrip_text";
  nullSpan.className = "_date";
  scripDiv.className = "video__comment__scrip";
  btnDiv.className = "video__comment__Btn";
  removeSpan.className = "removeBtn";
  editSpan.className = "editBtn";

  scripSpan.innerText = `${name} `;
  scripIcon.textContent = text;

  removeSpan.addEventListener("click", (e) => handleRemove(e));
  editSpan.addEventListener("click", (e) => handleEdit(e));
  videoComments.prepend(newComment); // ul 태그안에 <재일 먼저> li 태그를 넣음
  newComment.appendChild(scripDiv); // li 태그 안에 <재일 마지막에> div을 넣음
  newComment.appendChild(btnDiv); // li 태그 안에 <재일 마지막에> div2을 넣음
  newComment.prepend(nullSpan); // 날짜 date 공간 채우기
  scripDiv.appendChild(scripSpan); // scripDiv 태그 안에 <재일 마지막에>span을 넣음
  scripSpan.appendChild(scripIcon);
  btnDiv.appendChild(editSpan); // btnDiv 태그 안에 <재일 마지막에>span3을 넣음
  btnDiv.appendChild(removeSpan); // btnDiv 태그 안에 <재일 마지막에>span2을 넣음
  editSpan.appendChild(editIcon);
  removeSpan.appendChild(trashIcon);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!action) {
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
      const { newCommentId, username } = await response.json(); //백엔드에서 json형식으로 response 한 data를 받을수있다.

      addComment(text, newCommentId, username);
    }
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

//자식 엘리먼트 이벤트리스너 만들기

const handleRemove = async (e) => {
  if (!action) {
    const parent = e.target.parentElement.parentElement.parentElement; //부모 요소 선택

    console.log(parent);
    const id = parent.dataset.id;
    console.log(id);
    if (confirm("정말로 삭제하시겠습니까?")) {
      await fetch(`/api/comment/${id}/remove`, {
        method: "DELETE",
      });
      parent.remove();
    }
  }
};

const handleEdit = (e) => {
  action = !action;
  const parent = e.target.parentElement.parentElement.parentElement;
  const id = parent.dataset.id;
  const textArea = parent.childNodes[1].firstElementChild.lastChild;
  const buttonArea = parent.nextSibling;
  const myText = parent.childNodes[1].firstElementChild.firstElementChild;
  console.log("확인", parent.childNodes[1]);
  // console.log("확인", parent.childNodes[1].firstElementChild.lastChild);
  const editTextarea = document.createElement("textarea");
  editTextarea.className = "edit__textArea";

  if (textArea.nodeName !== "TEXTAREA") {
    myText.style.display = "none";
    editTextarea.value = myText.innerText;
    myText.insertAdjacentElement("afterend", editTextarea);
    editTextarea.focus();
  } else {
    myText.style.display = "block";
    textArea.remove();
  }

  if (buttonArea.nodeName !== "BUTTON") {
    const editBtn = document.createElement("button");
    editBtn.className = "edit__button";
    parent.insertAdjacentElement("afterend", editBtn);
    editBtn.innerText = "Update";
    editBtn.addEventListener("click", (e) => handleEditSubmit(e, id));
  } else {
    buttonArea.remove();
  }
};

const handleEditSubmit = async (e, id) => {
  console.log(id);
  const textArea =
    e.target.previousSibling.childNodes[1].firstElementChild.lastChild;
  const myText =
    e.target.previousSibling.childNodes[1].firstElementChild.firstElementChild;
  const text = textArea.value;
  const response = await fetch(`/api/comment/${id}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    myText.innerText = textArea.value;
    textArea.remove();
    e.target.remove();
    myText.style.display = "block";
  }
  action = false;
};

removeBtn.forEach((i) => {
  i.addEventListener("click", (e) => handleRemove(e));
});

editBtn.forEach((i) => {
  i.addEventListener("click", (e) => handleEdit(e));
});

commentDate.forEach((i) => {
  const date = Number(i.innerText);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return (i.innerText = "방금 전");
  } else if (minutes < 60) {
    return (i.innerText = `${minutes}분 전`);
  } else if (hours < 24) {
    return (i.innerText = `${hours}시간 전`);
  } else if (days < 30) {
    return (i.innerText = `${days}일 전`);
  } else if (months < 12) {
    return (i.innerText = `${months}개월 전`);
  } else {
    return (i.innerText = `${years}년 전`);
  }
});

likeBtn.forEach((i) => i.addEventListener("click", (e) => handleLike(e)));

const handleLike = async (e) => {
  console.log(e.target);
  const like = e.target;
  // isLike = !isLike;
  console.log(like.className);

  if (like.className === "fas fa-thumbs-up") {
    like.className = "fas fa-thumbs-up active";

    like.innerText++;
  } else {
    like.className = "fas fa-thumbs-up";

    like.innerText--;
  }
  // if (isLike) {
  //   like.className = "far fa-thumbs-up active";
  //   like.innerText++;
  // } else {
  //   like.className = "far fa-thumbs-up";
  //   like.innerText--;
  // }

  const id = e.target.parentElement.parentElement.dataset.id;

  await fetch(`/api/comment/${id}/like`, {
    method: "POST",
  });
};
//왓치 템플릿에서
// 로그인한 유저네임이 코멘트 like 배열에 있다면
// fas.fa-thumbs 아이콘 클래스명 active 변경
// 없다면 기본 아이콘으로

// JS에서는 그냥 on/off??
//
