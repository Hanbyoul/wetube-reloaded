import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";
const videosRouter = express.Router();

videosRouter.get("/:id(\\d+)", see); //정규식 d:숫자만 , "+" : 게속해서
videosRouter.get("/:id(\\d+)/edit", edit);
videosRouter.get("/:id(\\d+)/delete", deleteVideo);
videosRouter.get("/upload", upload);

export default videosRouter;
