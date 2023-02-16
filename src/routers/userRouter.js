import express from "express";
import {
  getEdit,
  postEdit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  startKakaoLogin,
  finishKakaoLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

// .all() get,post,delete,pull 메소드 모두 middleware를 사용할 수 있다.

//protectorMiddleware - 로그인 된 유저만 이용할 수 있게
//publicOnlyMiddleware - 로그인 되지않은 유저만 이용할 수 있게

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
//multer가 input의 "name"으로 설정한 "avatar"의 파일을 받아서
//그파일을 uploads 폴더에 저장한 다음
//그파일 정보를 postEdit에 전달해준다.
//이후 req.file 이 사용가능하다.
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/:id", see);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);

export default userRouter;
