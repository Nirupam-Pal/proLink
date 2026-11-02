import { clientServer } from "@/config";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      // The token lets the server mark which posts this user has liked
      const response = await clientServer.get("/posts", {
        params: { token: localStorage.getItem("token") || undefined },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
  { condition: (_, { getState }) => !getState().postReducer.postsPending }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();

      formData.append("token", localStorage.getItem("token"));

      formData.append("body", body || "");
      if (file) {
        formData.append("media", file);
      }

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue(response.data.post);
      } else {
        return thunkAPI.rejectWithValue("Post not uploaded");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id,
        },
      });

      return thunkAPI.fulfillWithValue({
        ...response.data,
        post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// Optimistic flip of a post's like on screen (handled in postReducer)
export const likeToggled = createAction("post/likeToggled");

// Sends one like toggle; skipped while a request for the same post is still in flight
export const syncPostLike = createAsyncThunk(
  "post/syncPostLike",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.post("/toggle_post_like", {
        token: localStorage.getItem("token"),
        post_id,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  },
  { condition: (post_id, { getState }) => !getState().postReducer.likeSync[post_id]?.inFlight }
);

// Flips the like on screen at once, then brings the server in line. Clicks made while a request is
// in flight only change the wanted state; when the request returns, one more toggle is sent if the
// server doesn't match it yet, so rapid clicking never fires one request per click.
export const togglePostLike = (post_id) => async (dispatch, getState) => {
  dispatch(likeToggled(post_id));

  for (;;) {
    const result = await dispatch(syncPostLike(post_id));
    if (!syncPostLike.fulfilled.match(result)) return;

    const post = getState().postReducer.posts.find((p) => p._id === post_id);
    if (!post || post.isLiked === result.payload.isLiked) return;
  }
};

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id,
        },
      });
      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue("Somethin went wrong");
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);
