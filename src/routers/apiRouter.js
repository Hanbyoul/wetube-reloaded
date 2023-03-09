import express from "express";
import {
  createComment,
  editComment,
  registerView,
  removeComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/comment/:id([0-9a-f]{24})/edit", editComment);
apiRouter.delete("/comment/:id([0-9a-f]{24})/remove", removeComment);
export default apiRouter;
