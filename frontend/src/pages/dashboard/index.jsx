import { createPost, deletePost, getAllComments, getAllPosts, incrementPostLike, postComment } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css"
import { resetPostId } from "@/config/redux/reducer/postReducer";
import { normalizeMedia, normalizePicture } from "@/utils/media";

const icons = {
  like: "M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z",
  comment: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  share: "M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z",
  trash: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
  image: "m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z",
  close: "M6 18 18 6M6 6l12 12",
};

function Icon({ d }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function PostSkeleton() {
  return (
    <div className={`card ${styles.singleCard}`} aria-hidden="true">
      <div className={styles.cardHead}>
        <span className="skeleton" style={{ width: 44, height: 44, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <span className="skeleton" style={{ display: "block", width: 140, height: 12 }} />
          <span className="skeleton" style={{ display: "block", width: 90, height: 10, marginTop: 8 }} />
        </div>
      </div>
      <span className="skeleton" style={{ display: "block", width: "92%", height: 12 }} />
      <span className="skeleton" style={{ display: "block", width: "70%", height: 12 }} />
      <span className="skeleton" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", borderRadius: 10 }} />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.postReducer)

  // DashboardLayout loads the current user and the user list; start posts in parallel with them
  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      router.push("/login")
    } else {
      dispatch(getAllPosts());
    }
  }, [])

  const [postContent, setPostContent] = useState("");

  const [fileContent, setFileContent] = useState();

  const [commentText, setCommentText] = useState("");

  const [expandedPosts, setExpandedPosts] = useState({});

  // UI-only feedback state: which post's like just landed, and whether a post is uploading
  const [justLiked, setJustLiked] = useState(null);
  const [posting, setPosting] = useState(false);

  const toggleExpand = (id) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle expanded state for the specific post
    }));
  };

  // createObjectURL allocates a new blob URL on every call, so make it once per file and release it
  const previewUrl = useMemo(
    () => (fileContent && fileContent.type.startsWith("image/") ? URL.createObjectURL(fileContent) : null),
    [fileContent]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // createPost.fulfilled already prepends the new post, so no full refetch is needed
  const handleUpload = async () => {
    setPosting(true);
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPosting(false);
    setPostContent("")
    setFileContent(null)
  }

  const handleComment = async () => {
    await dispatch(postComment({ post_id: postState.postId, body: commentText }))
    await dispatch(getAllComments({ post_id: postState.postId }))
    setCommentText("")
  }

  const me = authState.user?.userId;

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.wrapper}>
          <header className={styles.pageHead}>
            <h1 className={`display ${styles.pageTitle}`}>Scroll</h1>
            <p className={styles.pageSub}>Stories from your network, newest first.</p>
          </header>

          {/* Create Post */}
          {me ? (
            <div className={`card ${styles.composer}`}>
              <div className={styles.composerRow}>
                <img className="avatar" src={normalizePicture(me.profilePicture, 96)} alt="" width={44} height={44} />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  className={styles.textAreaOfContent}
                  aria-label="Write a post"
                  placeholder="What's in your mind?"
                  rows={postContent.length > 80 ? 4 : 2}
                ></textarea>
              </div>

              {/* Preview File */}
              {fileContent && (
                <div className={styles.previewContainer}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className={styles.previewImage} />
                  ) : (
                    <p className={styles.previewFileName}>{fileContent.name}</p>
                  )}
                  <button type="button" className={`icon-btn ${styles.previewRemove}`} onClick={() => setFileContent(null)} aria-label="Remove attachment">
                    <Icon d={icons.close} />
                  </button>
                </div>
              )}

              <div className={styles.composerBar}>
                <label htmlFor="fileUpload" className={styles.attach}>
                  <Icon d={icons.image} />
                  <span>Photo</span>
                </label>
                <input
                  onChange={(e) => {
                    setFileContent(e.target.files[0]);
                    e.target.value = ""; // allow picking the same file again after removing it
                  }}
                  type="file"
                  hidden
                  id="fileUpload"
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  className="btn btn-accent btn-sm"
                  disabled={postContent.length === 0 || posting}
                >
                  {posting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          ) : (
            <div className={`card ${styles.composer}`} aria-hidden="true">
              <div className={styles.composerRow}>
                <span className="skeleton" style={{ width: 44, height: 44, borderRadius: "50%" }} />
                <span className="skeleton" style={{ flex: 1, height: 56, borderRadius: 10 }} />
              </div>
            </div>
          )}

          {/* Posts */}
          <div className={styles.postContainer}>
            {(!me || !postState.postFetched) && postState.posts.length === 0 && (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}

            {me && postState.postFetched && postState.posts.length === 0 && (
              <div className={styles.empty}>
                <p className="display">Nothing here yet.</p>
                <p>Be the first to share a story.</p>
              </div>
            )}

            {me && postState.posts.map((post, index) => {
              const user = post?.userId; // easy alias
              if (!user) return null;

              // First couple of cards are on screen at load; defer the rest until scrolled near
              const loading = index < 2 ? "eager" : "lazy";
              const expanded = expandedPosts[post._id];

              return (
                <article
                  key={post._id || index}
                  className={`card ${styles.singleCard}`}
                  style={{ "--stagger": `${Math.min(index, 6) * 50}ms` }}
                >
                  <div className={styles.cardHead}>
                    <button type="button" className={styles.author} onClick={() => router.push(`/view_profile/${user.username}`)}>
                      <img className="avatar" src={normalizePicture(user?.profilePicture, 96)} alt="" width={44} height={44} loading={loading} decoding="async" />
                      <span className={styles.profileText}>
                        <span className={styles.profileName}>{user?.name}</span>
                        <span className={styles.singleCard__username}>@{user?.username}</span>
                      </span>
                    </button>

                    {user?._id === me?._id && (
                      <button
                        type="button"
                        className={`icon-btn ${styles.deleteBtn}`}
                        aria-label="Delete post"
                        onClick={() => {
                          // deletePost.fulfilled removes the post locally; a parallel refetch
                          // could race the delete and bring the post back
                          dispatch(deletePost({ post_id: post._id }));
                        }}
                      >
                        <Icon d={icons.trash} />
                      </button>
                    )}
                  </div>

                  {post.body && (
                    <p className={expanded ? styles.postBodyExpanded : styles.postBody}>
                      {expanded ? post.body || "" : (post.body || "").slice(0, 100)}
                      {post.body?.length > 100 && (
                        <button type="button" onClick={() => toggleExpand(post._id)} className={styles.readMore}>
                          {expanded ? " Show less" : "… more"}
                        </button>
                      )}
                    </p>
                  )}

                  {/* Media */}
                  {post.media && normalizeMedia(post.media) ? (
                    <div className={styles.singleCard__image}>
                      <img src={normalizeMedia(post.media)} alt="" loading={loading} decoding="async" />
                    </div>
                  ) : null}

                  {/* Options */}
                  <div className={styles.optionsContainer}>
                    <button
                      type="button"
                      onClick={() => {
                        // incrementPostLike.fulfilled bumps the count locally; no full refetch
                        dispatch(incrementPostLike({ post_id: post._id, user_id: me?._id }))
                        setJustLiked(post._id)
                      }}
                      onAnimationEnd={() => setJustLiked(null)}
                      className={`${styles.action} ${justLiked === post._id ? styles.liked : ""}`}
                      aria-label="Like"
                    >
                      <Icon d={icons.like} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        dispatch(getAllComments({ post_id: post._id }))
                      }}
                      className={styles.action}
                      aria-label="Comments"
                    >
                      <Icon d={icons.comment} />
                      <span>Comment</span>
                    </button>

                    <button type="button" onClick={() => {

                    }} className={styles.action} aria-label="Share">
                      <Icon d={icons.share} />
                      <span>Share</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {
          postState.postId !== "" &&
          <div
            className="modal-backdrop"
            onClick={() => { dispatch(resetPostId()); }}
          >
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Comments"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <h2>Comments</h2>
                <button type="button" className="icon-btn" onClick={() => dispatch(resetPostId())} aria-label="Close comments">
                  <Icon d={icons.close} />
                </button>
              </div>

              <div className={styles.commentList}>
                {postState.comments.length === 0 && (
                  <div className={styles.noComments}>
                    <p className="display">No Comments</p>
                    <p>Start the conversation.</p>
                  </div>
                )}

                {postState.comments.map((comment, index) => {
                  return (
                    <div className={styles.singleComment} key={comment._id || index}>
                      <span className={styles.commentInitial} aria-hidden="true">
                        {(comment?.userId?.username || "?").charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className={styles.commentAuthor}>{comment?.userId?.username}</p>
                        <p className={styles.commentBody}>{comment.body}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className={styles.postCommentContainer}>
                <input
                  className="field"
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && commentText.trim()) handleComment();
                  }}
                  placeholder="Comment"
                  aria-label="Write a comment"
                  autoFocus
                />
                <button type="button" onClick={handleComment} className="btn btn-accent" disabled={!commentText.trim()}>
                  Comment
                </button>
              </div>
            </div>
          </div>
        }
      </DashboardLayout>
    </UserLayout>
  );
}
