import express from "express";
import {
  watch,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, uploadFiles, videoUpload } from "../middlewares";
const videosRouter = express.Router();

videosRouter.get("/:id([0-9a-f]{24})", watch);
videosRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videosRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videosRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
export default videosRouter;
