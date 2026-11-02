import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Server is active" });
};

export const createPost = async (req, res) => {
  const { token, body } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: body || "",
      media: req.file ? { url: req.file.path || req.file.secure_url || "", filename: req.file.filename } : { url: "", filename: "" },
      fileType: req.file ? req.file.mimetype.split("/")[1] : "",
    });


    await post.save();

    // Same fields as getAllPosts; never send the author's password hash or token
    const populatedPost = await post.populate("userId", "name username email profilePicture");
    const { likedBy, ...postData } = populatedPost.toObject();

    return res.status(200).json({ message: "Post Created", post: { ...postData, likes: 0, isLiked: false } });
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Like count comes from likedBy, plus whether the given user is in it; likedBy itself never leaves the server
const likeFields = (userId) => {
  const likedBy = { $ifNull: ["$likedBy", []] };
  return {
    likes: { $size: likedBy },
    isLiked: userId ? { $in: [userId, likedBy] } : false,
  };
};

export const getAllPosts = async (req, res) => {
  const { token } = req.query;

  try {
    // The token is optional here: without it every post is reported as not liked
    const viewer = token ? await User.findOne({ token }).select("_id").lean() : null;

    const posts = await Post.aggregate([
      { $addFields: likeFields(viewer?._id) },
      { $project: { likedBy: 0 } },
    ]);
    await Post.populate(posts, { path: "userId", select: "name username email profilePicture" });

    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).status({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (post.media && post.media.filename) {
      try {
        await cloudinary.uploader.destroy(post.media.filename);
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr.message);
      }
    }

    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "Post Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {

  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();

    return res.status(200).json({ message: "Comment Added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const get_comment_by_post = async (req, res) => {
  const {post_id} = req.query;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({postId: post_id}).populate("userId", "username name").lean();

    return res.json(comments.reverse());
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = Post.findOne({ _id: comment_id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() != user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });

    return res.json({message: "Comment Deleted"});

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const toggle_post_like = async (req, res) => {
  const { token, post_id } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  if (!mongoose.isValidObjectId(post_id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  try {
    // The liker always comes from the session token, never from an id sent by the client
    const user = await User.findOne({ token }).select("_id").lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }

    // One pipeline update: remove the user if they already liked the post, otherwise add them.
    // MongoDB applies it to the document atomically, so simultaneous requests can never add the same user twice.
    const likedBy = { $ifNull: ["$likedBy", []] };
    const post = await Post.findByIdAndUpdate(
      post_id,
      [
        {
          $set: {
            likedBy: {
              $cond: [
                { $in: [user._id, likedBy] },
                { $filter: { input: likedBy, cond: { $ne: ["$$this", user._id] } } },
                { $concatArrays: [likedBy, [user._id]] },
              ],
            },
          },
        },
      ],
      { new: true, projection: { likedBy: 1 } }
    ).lean();

    // Also covers a post deleted while the like was in flight
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likedBy.some((id) => id.equals(user._id));

    return res.json({
      message: isLiked ? "Post liked" : "Post unliked",
      post_id,
      likes: post.likedBy.length,
      isLiked,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
