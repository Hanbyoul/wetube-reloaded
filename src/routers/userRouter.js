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
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

// .all() get,post,delete,pull 메소드 모두 middleware를 사용할 수 있다.

//protectorMiddleware - 로그인 된 유저만 이용할 수 있게
//publicOnlyMiddleware - 로그인 되지않은 유저만 이용할 수 있게

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);
userRouter.get("/:id", see);

export default userRouter;
