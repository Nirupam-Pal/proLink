import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "@/styles/Profile.module.css"
import { clientServer } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import { normalizeMedia, normalizePicture } from '@/utils/media';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

function ProfileSkeleton() {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={styles.cover} />
      <div className={styles.head}>
        <span className={`skeleton ${styles.avatarWrap}`} style={{ borderRadius: "50%" }} />
      </div>
      <span className="skeleton" style={{ display: "block", width: 220, height: 28, marginTop: 16 }} />
      <span className="skeleton" style={{ display: "block", width: 120, height: 12, marginTop: 10 }} />
      <span className="skeleton" style={{ display: "block", width: "80%", height: 12, marginTop: 32 }} />
      <span className="skeleton" style={{ display: "block", width: "60%", height: 12, marginTop: 10 }} />
    </div>
  );
}

export default function Profile() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

  const postReducer = useSelector((state) => state.postReducer)

  const [userProfile, setUserProfile] = useState({});

  const [userPosts, setUserPosts] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEduModalOpen, setIsEduModalOpen] = useState(false);

  const [inputData, setInputData] = useState({ company: '', position: '', years: '' })

  const [eduInputData, setEduInputData] = useState({ school: '', degree: '', fieldOfStudy: '' })

  // UI-only feedback for the two network actions on this page
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target
    setInputData({ ...inputData, [name]: value })
  }

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target
    setEduInputData({ ...eduInputData, [name]: value })
  }


  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    dispatch(getAllPosts())
  }, [])

  useEffect(() => {

    if (authState.user != undefined) {
      setUserProfile(authState.user)
      let post = postReducer.posts.filter((post) => {
        return post.userId?.username === authState.user.userId.username
      })
      setUserPosts(post)
    }
  }, [authState.user, postReducer.posts])


  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    setUploadingPicture(true);
    try {
      const response = await clientServer.post("/update_profile_picture", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    } finally {
      setUploadingPicture(false);
    }

  }


  const updateProfileData = async () => {
    setSaving(true);
    try {
      const request = await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name
      });

      const response = await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    } finally {
      setSaving(false);
    }
  }

  const dirty = userProfile != authState.user;

  return (
    <UserLayout>
      <DashboardLayout>
        {!(authState.user && userProfile.userId) && <ProfileSkeleton />}

        {authState.user && userProfile.userId &&
          <div className={styles.container}>
            <div className={styles.cover} aria-hidden="true" />

            <div className={styles.head}>
              <label htmlFor='profilePictureUpload' className={`${styles.avatarWrap} ${styles.editable}`}>
                <img className="avatar" src={normalizePicture(userProfile.userId.profilePicture, 400)} alt="Your profile picture" />
                <span className={styles.avatarOverlay}>{uploadingPicture ? "Uploading…" : "Edit"}</span>
                <input onChange={(e) => {
                  updateProfilePicture(e.target.files[0])
                }} style={{ display: "none" }} type="file" id='profilePictureUpload' accept="image/*" />
              </label>

              <div className={styles.headActions}>
                {dirty &&
                  <button
                    type="button"
                    onClick={() => {
                      updateProfileData();
                    }}
                    className={`btn btn-accent ${styles.saveBtn}`}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Update Profile"}
                  </button>
                }
              </div>
            </div>

            <div className={styles.identity}>
              <input
                className={`display ${styles.nameEdit}`}
                type="text"
                aria-label="Your name"
                value={userProfile.userId.name}
                onChange={(e) => {
                  setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                }}
              />
              <p className={styles.handle}>@{userProfile.userId.username}</p>
            </div>

            <div className={styles.body}>
              <div className={styles.main}>
                <section className={styles.block}>
                  <h2 className={styles.blockTitle}>About</h2>
                  <textarea
                    className={`field ${styles.bioEdit}`}
                    value={userProfile.bio}
                    placeholder="Write a short bio"
                    aria-label="Bio"
                    onChange={(e) => {
                      setUserProfile({ ...userProfile, bio: e.target.value });
                    }}
                    rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                    spellCheck={false}
                  />
                </section>

                <section className={styles.block}>
                  <div className={styles.blockHead}>
                    <h2 className={styles.blockTitle}>Work History</h2>
                    <button type="button" className="btn btn-soft btn-sm" onClick={() => {
                      setIsModalOpen(true)
                    }}>+ Add Work</button>
                  </div>

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
                  <div className={styles.blockHead}>
                    <h2 className={styles.blockTitle}>Education</h2>
                    <button type="button" className="btn btn-soft btn-sm" onClick={() => {
                      setIsEduModalOpen(true)
                    }}>+ Add Education</button>
                  </div>

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
        }

        {
          isModalOpen &&
          <div
            onClick={() => {
              setIsModalOpen(false)
            }}
            className="modal-backdrop">

            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Add work">

              <div className="modal-head">
                <h2>Add Work</h2>
                <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)} aria-label="Close">
                  <CloseIcon />
                </button>
              </div>

              <div className={styles.modalBody}>
                <input
                  onChange={handleWorkInputChange}
                  name='company'
                  className="field"
                  type="text"
                  placeholder="Enter Company"
                  autoFocus
                />
                <input
                  onChange={handleWorkInputChange}
                  name='position'
                  className="field"
                  type="text"
                  placeholder="Enter Position"
                />
                <input
                  onChange={handleWorkInputChange}
                  name='years'
                  className="field"
                  type="number"
                  placeholder="Years"
                />

                <button
                  type="button"
                  onClick={() => {
                    setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] })
                    setInputData({ company: '', position: '', years: '' })
                    setIsModalOpen(false)
                  }}
                  className="btn btn-accent">
                  Add Work
                </button>
              </div>

            </div>

          </div>
        }

        {
          isEduModalOpen &&
          <div
            onClick={() => {
              setIsEduModalOpen(false)
            }}
            className="modal-backdrop">

            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Add education">

              <div className="modal-head">
                <h2>Add Education</h2>
                <button type="button" className="icon-btn" onClick={() => setIsEduModalOpen(false)} aria-label="Close">
                  <CloseIcon />
                </button>
              </div>

              <div className={styles.modalBody}>
                <input
                  onChange={handleEducationInputChange}
                  name='school'
                  className="field"
                  type="text"
                  placeholder="Enter Your School"
                  autoFocus
                />
                <input
                  onChange={handleEducationInputChange}
                  name='degree'
                  className="field"
                  type="text"
                  placeholder="Enter Your Degree"
                />
                <input
                  onChange={handleEducationInputChange}
                  name='fieldOfStudy'
                  className="field"
                  type="text"
                  placeholder="Enter Your Field Of Study"
                />

                <button
                  type="button"
                  onClick={() => {
                    setUserProfile({ ...userProfile, education: [...userProfile.education, eduInputData] })
                    setEduInputData({ school: '', degree: '', fieldOfStudy: '' })
                    setIsEduModalOpen(false)
                  }}
                  className="btn btn-accent">
                  Add Education
                </button>
              </div>

            </div>

          </div>
        }
      </DashboardLayout>
    </UserLayout>
  )
}
