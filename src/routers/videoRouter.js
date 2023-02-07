import express from "express";
import {
  watch,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
} from "../controllers/videoController";
const videosRouter = express.Router();

videosRouter.get("/:id(\\d+)", watch);
videosRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videosRouter.route("/upload").get(getUpload).post(postUpload);
export default videosRouter;
