import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  likeToggled,
  syncPostLike,
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
  // Per post: whether a like request is in flight, and the last like state the server confirmed
  likeSync: {},
};

const findPost = (state, id) => state.posts.find((p) => p._id === id);

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
        // Keep the on-screen state of posts whose like is still syncing; everything else takes the server's values
        const pending = Object.keys(state.likeSync).filter((id) => state.likeSync[id].inFlight);
        const local = Object.fromEntries(
          pending.map((id) => [id, findPost(state, id)]).filter(([, p]) => p).map(([id, p]) => [id, { isLiked: p.isLiked, likes: p.likes }])
        );
        state.posts = action.payload.posts.reverse().map((p) => (local[p._id] ? { ...p, ...local[p._id] } : p));
        state.likeSync = Object.fromEntries(pending.map((id) => [id, state.likeSync[id]]));
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
      // Optimistic flip; the server-confirmed state is remembered first so a failed request can roll back
      .addCase(likeToggled, (state, action) => {
        const post = findPost(state, action.payload);
        if (!post) return;
        if (!state.likeSync[post._id]) {
          state.likeSync[post._id] = {
            inFlight: false,
            confirmed: { isLiked: !!post.isLiked, likes: post.likes || 0 },
          };
        }
        post.isLiked = !post.isLiked;
        post.likes = (post.likes || 0) + (post.isLiked ? 1 : -1);
      })
      .addCase(syncPostLike.pending, (state, action) => {
        state.likeSync[action.meta.arg].inFlight = true;
      })
      // The server's count is authoritative (it includes other users' likes). If more clicks came in
      // meanwhile, keep showing the wanted state; togglePostLike sends the follow-up request.
      .addCase(syncPostLike.fulfilled, (state, action) => {
        const { post_id, likes, isLiked } = action.payload;
        state.likeSync[post_id] = { inFlight: false, confirmed: { isLiked, likes } };
        const post = findPost(state, post_id);
        if (!post) return;
        post.likes = post.isLiked === isLiked ? likes : likes + (post.isLiked ? 1 : -1);
      })
      .addCase(syncPostLike.rejected, (state, action) => {
        const post_id = action.meta.arg;
        const sync = state.likeSync[post_id];
        if (!sync) return;
        sync.inFlight = false;
        // The post was deleted meanwhile: drop it from the feed. Matching the message too means a
        // missing route (e.g. an older backend still deployed) only rolls back instead of hiding posts.
        if (action.payload?.status === 404 && action.payload?.message === "Post not found") {
          state.posts = state.posts.filter((p) => p._id !== post_id);
          return;
        }
        const post = findPost(state, post_id);
        if (post) Object.assign(post, sync.confirmed);
      });
  },
});

export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;
