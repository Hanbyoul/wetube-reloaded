# ![favicon-32x32](https://user-images.githubusercontent.com/99850326/229418839-698294aa-4206-44c5-ad7e-5de128d58586.png) Wetube

> 유튜브 클론코딩 프로젝트

<br/>

## 프로젝트 개요

- 백엔드 api를 통한 프론트엔드와의 소통 및 HTTP 메서드 이해
- 실제 서비스기능 분석,구현하기

### 배포

- https://wetube-hanbyoul.herokuapp.com/

<br/>

### 사용한 기술스택

| Sections      | Skills                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Front-end** | <img src="https://img.shields.io/badge/javascript-yellow?style=flat&logo=javascript&logoColor=white"/> <img src="https://img.shields.io/badge/Sass-CC6699?style=flat&logo=Sass&logoColor=white"/> <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white"/>                                                                                             |
| **Back-end**  | <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=green"/> <img src="https://img.shields.io/badge/mongoDB-47A248?style=flat&logo=mongoDB&logoColor=green"/> <img src="https://img.shields.io/badge/Express-white?style=flat&logo=Express&logoColor=black"/> <img src="https://img.shields.io/badge/Pug-A86454?style=flat&logo=Pug&logoColor=black"/> |
| **Deploy**    | <img src="https://img.shields.io/badge/Webpack-white?style=flat&logo=Webpack&logoColor=8DD6F9"/> <img src="https://img.shields.io/badge/Amazon S3-569A31?style=flat&logo=Amazon S3&logoColor=white"/> <img src="https://img.shields.io/badge/heroku-430098?style=flat&logo=heroku&logoColor=white"/>                                                                                       |

<br/>

## 실행

```
npm install
npm start
```

<br/>

## 구성

![스크린샷 2023-04-03 오후 7 08 11](https://user-images.githubusercontent.com/99850326/229480511-e34c3c61-9fd1-47c5-a9e9-55ff68dee23f.png)

<br/>

## 구현기능

### USER

- 회원가입
  - 사용자가 회원가입을 하려면 `Name` `E-mail` `User Name` `Password` `Confirm Password` `Location` 필수 입력하여 진행해야 됩니다.
  - `Password`는 **bycrypt**으로 해쉬 처리하여 UserDB에 저장됩니다.
- 회원정보 수정
  - 사용자는 회원정보를 수정할 수 있습니다.
  - 프로필 사진을 등록,수정할 수 있습니다.
  - `Change Password`링크로 이동하여 `Password`를 수정할 수 있습니다.
- 소셜 로그인
  - OAuth를 활용하여 Kakao,github 구현하였습니다.
  - 회원정보 수정시 `Change Password`링크가 활성화 되지 않습니다.
  - 해당 소셜에 있는 프로필 사진이 자동으로 프로필 사진으로 등록됩니다.
    <br/>

### VIDEO

- Video Controller
  - 영상의 시간,볼륨 조절,음소거,일시정지,FullScreen이 가능합니다.
  - 일정시간 마우스의 움직임이 없을시 Controller가 사라지도록 하였습니다.
- 시청
  - 영상을 조회할 수 있으며, 영상 클릭시 영상시청,업로드 날짜,영상을 업로드한 유저를 확인할 수 있습니다.
  - 로그인하지 않은 유저는 영상 시청만 가능합니다.
  - 영상을 업로드한 유저 링크를 클릭하면, 유저의 프로필 페이지로 이동되며,해당 유저가 업로드한 영상들이 나열되어 있습니다.
  - 영상 시청을 완료하면 해당 영상의 조회수가 올라갑니다.
- 업로드
  - 로그인하지 않은 유저는 영상 업로드 링크가 활성화되지 않습니다.
  - 로그인한 유저는 영상을 업로드할 수 있습니다.
  - 업로드할 `video` `Thumbnail File` `Title` `Description` `Hashtags`를 필수 입력하여 진행해야 됩니다.
  - 프로필 사진을 클릭하면 유저 프로필 페이지에 이동되며, 업로드한 영상들이 나열되어 있습니다.
- 녹화
  - 5초간 녹화가 가능하며, 녹화완료후 Download 버튼 클릭시 mp4파일로 변환되며, 변환후 Download할 수 있습니다.
  - Download시 썸네일 사진도 가치 받을 수 있습니다.
- 수정
  - 영상의 주인은 Title , Description , Hashtags를 수정할 수 있습니다.
- 삭제
  - 영상의 주인은 영상을 삭제할 수 있습니다.
- 검색
  - 검색 아이콘을 클릭하여 영상을 검색할 수 있습니다.
  - 검색된 결과가 없을 경우 "No Videos found"로 출력됩니다.
    <br>

### Comments

- 로그인하지 않은 유저는 Comment가 보이지 않습니다.
- 생성
  - 로그인한 유저는 Comment를 생성할 수 있습니다.
- 수정
  - Comment의 주인은 수정할 수 있으며, 수정 취소가 가능합니다.
- 삭제
  - Comment의 주인은 Comment를 삭제할 수 있습니다.
- 좋아요버튼
  - **다른유저가 작성한** Comment에 좋아요 버튼을 **1회** 누를수 있으며, 취소가 가능합니다.

### 추가했으면 하는 기능

- 회원탈퇴 기능
- 영상 조회시 페이지네이션 기능
- 사용자 시청 정보 조회
