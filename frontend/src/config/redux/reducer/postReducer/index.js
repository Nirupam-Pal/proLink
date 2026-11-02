import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLike,
} from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  postsPending: false,
  isLoading: false,
  loggedin: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.postsPending = true;
        state.isLoading = true;
        state.message = "Fetching all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.postsPending = false;
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.postsPending = false;
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.message = "Uploading post...";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
        state.isLoading = false;
        state.isError = false;
        state.message = "Post uploaded successfully!";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to upload post";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedId = action.payload.post_id;
        state.posts = state.posts.filter((p) => p._id !== deletedId);
        state.message = action.payload.message || "Post deleted successfully!";
      })
      // The server adds exactly one like, so mirror it locally instead of refetching every post
      .addCase(incrementPostLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.post_id);
        if (post) post.likes = (post.likes || 0) + 1;
      });
  },
});

export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;
