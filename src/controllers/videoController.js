import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";
import session from "express-session";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", { pageTitle: video.title, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.HashTagsForm(hashtags),
  });

  req.flash("success", "Changes saved");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";

  try {
    const newVideo = await Video.create({
      title,
      description,
      owner: _id,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      hashtags: Video.HashTagsForm(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("videos/search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user: sessionUser },
  } = req;
  const video = await Video.findById(id);
  const user = await User.findById(sessionUser._id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: sessionUser._id,
    ownerName: user.username,
    video: id,
  });

  video.comments.push(comment._id);
  user.comments.push(comment._id);
  video.save();
  user.save();

  return res.status(201).json({
    newCommentId: comment._id,
    username: user.username,
  });
};

export const removeComment = async (req, res) => {
  const {
    session: { user: sessionUser },
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  const video = await Video.findById(comment.video);
  const user = await User.findById(sessionUser._id);

  if (!video || !user) {
    return res.sendStatus(404);
  }

  if (user._id.toString() !== comment.owner.toString()) {
    return res.sendStatus(404);
  }

  await Comment.findByIdAndDelete(id);
  video.comments.splice(video.comments.indexOf(id), 1);
  video.save();
  user.comments.splice(user.comments.indexOf(id), 1);
  user.save();

  return res.sendStatus(200);
};

export const editComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user: sessionUser },
  } = req;
  const comment = await Comment.findById(id);

  if (!comment) {
    return res.sendStatus(404);
  }

  if (sessionUser._id !== comment.owner.toString()) {
    return res.sendStatus(404);
  }

  comment.text = text;
  comment.save();
  return res.sendStatus(201);
};

export const likeComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.sendStatus(404);
  }

  const userChecked = comment.like.includes(user.username);

  if (!userChecked) {
    comment.like.push(user.username);
  } else {
    comment.like.splice(comment.like.indexOf(user.username), 1);
  }
  comment.save();

  return res.sendStatus(201);
};
