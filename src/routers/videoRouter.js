import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";
const videosRouter = express.Router();

videosRouter.get("/upload", upload);
videosRouter.get("/:id", see);
videosRouter.get("/:id/edit", edit);
videosRouter.get("/:id/delete", deleteVideo);

export default videosRouter;
