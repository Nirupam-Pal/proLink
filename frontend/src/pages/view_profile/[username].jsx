import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import styles from "@/styles/Profile.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';
import { normalizeMedia, normalizePicture } from '@/utils/media';

export default function ViewProfilePage({ userProfile }) {

  const router = useRouter()
  const postReducer = useSelector((state) => state.postReducer)
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth)

  const [userPosts, setUserPosts] = useState([])

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false)

  const [isConnectionNull, setIsConnectionNull] = useState(true)

  const [downloading, setDownloading] = useState(false)

  // Independent requests: run them in parallel instead of one after another
  const getUserPost = async () => {
    const token = localStorage.getItem("token");
    await Promise.all([
      dispatch(getAllPosts()),
      dispatch(getConnectionsRequest({ token })),
      dispatch(getMyConnectionRequests({ token })),
    ]);
  }

  useEffect(() => {

    let post = postReducer.posts.filter((post) => {
      return post.userId?.username === router.query.username
    })

    setUserPosts(post);

  }, [postReducer.posts])




  useEffect(() => {
    if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true)
      if (authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true) {
        setIsConnectionNull(false)
      }
    }
    if (authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true)
      if (authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true) {
        setIsConnectionNull(false)
      }
    }

  }, [authState.connections, authState.connectionRequest])


  useEffect(() => {
    getUserPost()
  }, [])

  const downloadResume = async () => {
    setDownloading(true);
    try {
      const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
      window.open(`${BASE_URL}/${response.data.message}`, "_blank")
    } finally {
      setDownloading(false);
    }
  }

  return (
    <UserLayout>
      <Head>
        <title>{`${userProfile.userId.name} (@${userProfile.userId.username}) · ProLink`}</title>
      </Head>

      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.cover} aria-hidden="true" />

          <div className={styles.head}>
            <div className={styles.avatarWrap}>
              <img className="avatar" src={normalizePicture(userProfile.userId.profilePicture, 400)} alt={userProfile.userId.name} />
            </div>

            <div className={styles.headActions}>
              {isCurrentUserInConnection ?
                <span className={isConnectionNull ? styles.pendingTag : styles.connectedTag}>
                  {isConnectionNull ? "Pending" : "Connected"}
                </span>
                :
                <button type="button" onClick={() => {
                  dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), user_id: userProfile.userId._id }))
                }} className="btn btn-accent">Connect</button>}

              <button type="button" className="btn btn-ghost" onClick={downloadResume} disabled={downloading} aria-label="Download résumé">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {downloading ? "Preparing…" : "Résumé"}
              </button>
            </div>
          </div>

          <div className={styles.identity}>
            <h1 className={`display ${styles.name}`}>{userProfile.userId.name}</h1>
            <p className={styles.handle}>@{userProfile.userId.username}</p>
          </div>

          <div className={styles.body}>
            <div className={styles.main}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>About</h2>
                {userProfile.bio
                  ? <p className={styles.bio}>{userProfile.bio}</p>
                  : <p className={styles.emptyLine}>No bio yet.</p>}
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>Work History</h2>
                {userProfile.pastWork.length === 0 ? (
                  <p className={styles.emptyLine}>No work history yet.</p>
                ) : (
                  <ol className={styles.timeline}>
                    {userProfile.pastWork.map((work, index) => (
                      <li key={index} className={styles.timelineItem}>
                        <p className={styles.itemTitle}>{work.company}</p>
                        <p className={styles.itemMeta}>{work.position} · {work.years}+ years</p>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>Education</h2>
                {userProfile.education.length === 0 ? (
                  <p className={styles.emptyLine}>No education added yet.</p>
                ) : (
                  <ol className={styles.timeline}>
                    {userProfile.education.map((edu, index) => (
                      <li key={index} className={styles.timelineItem}>
                        <p className={styles.itemTitle}>{edu.school}</p>
                        <p className={styles.itemMeta}>{edu.degree} - {edu.fieldOfStudy}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>

            <aside className={styles.side}>
              <h2 className={styles.blockTitle}>Recent Activity</h2>
              {userPosts.length === 0 && <p className={styles.emptyLine}>No posts yet.</p>}
              <ul className={styles.activity}>
                {userPosts.map((post) => {
                  const thumb = normalizeMedia(post.media, 160);
                  return (
                    <li key={post._id} className={styles.postCard}>
                      {thumb ? <img src={thumb} alt='' loading="lazy" decoding="async" />
                        : <span className={styles.thumbBlank} aria-hidden="true" />}
                      <p className={styles.recentPostCaption}>{post.body}</p>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </div>
        </div>
      </DashboardLayout>

    </UserLayout>
  )
}


export async function getServerSideProps(context) {

  let request;
  try {
    request = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        username: context.query.username
      }
    })
  } catch (err) {
    // Unknown username (or a profile without data) is a 404, not a server crash
    if (err.response?.status === 404) return { notFound: true };
    throw err;
  }

  if (!request.data.profile) return { notFound: true };

  // Public profile data: let Vercel's CDN serve repeat visits for a few seconds and
  // refresh it in the background, instead of every view waiting on the backend
  context.res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");

  return { props: { userProfile: request.data.profile } }
}
