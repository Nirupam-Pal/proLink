import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
} from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
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
        state.isLoading = true;
        state.message = "Fetching all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
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
      });
  },
});

export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;
