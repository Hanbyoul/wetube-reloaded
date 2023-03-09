import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  ownerName: { type: String },
  createdAt: { type: Number, required: true, default: Date.now },
  like: [{ type: String, trim: true }],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
