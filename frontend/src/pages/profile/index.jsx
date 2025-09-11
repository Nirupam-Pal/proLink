import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css"
import { BASE_URL, clientServer } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';

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
        return post.userId.username === authState.user.userId.username
      })
      setUserPosts(post)
    }
  }, [authState.user, postReducer.posts])


  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post("/update_profile_picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));

  }


  const updateProfileData = async () => {
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
  }

  const normalizePicture = (pic) => {
    if (!pic) return "/default-profile.png";

    // If pic is an object with a url property (new backend format)
    if (typeof pic === "object" && pic.url) {
      return pic.url;
    }

    // If pic is already a URL string
    if (typeof pic === "string" && pic.startsWith("http")) {
      return pic;
    }

    // Otherwise treat it as relative path from backend
    return `${BASE_URL}${pic}`;
  };

  const normalizeMedia = (media) => {
    if (!media) return "";
    if (media.startsWith("http")) return media; // full URL already
    // Cloudinary base URL
    return `https://res.cloudinary.com/dcdmxqiuv/image/upload/${media}`;
  };



  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId &&
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label htmlFor='profilePictureUpload' className={styles.backdrop__overlay}>
                <p>Edit</p>
                <input onChange={(e) => {
                  updateProfilePicture(e.target.files[0])
                }} style={{ display: "none" }} type="file" id='profilePictureUpload' />
              </label>
              {/* <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" /> */}
              <img src={normalizePicture(userProfile.userId.profilePicture)} alt="backdrop" />
            </div>

            <div className={styles.profileContainer_details}>

              <div className={styles.profileContainer_flex}>

                <div style={{ flex: "0.8" }}>
                  <div style={{ display: "flex", flexDirection: "column", width: "fit-content", marginBottom: "1.5rem" }}>
                    <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => {
                      setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                    }} />
                    <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>

                  </div>



                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      spellCheck={false}
                      style={{ width: "100%" }}
                    />
                  </div>

                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card__profileContainer}>

                            {post.media !== "" ? <img src={normalizeMedia(post.media)} alt='' />
                              : <div style={{ width: "3.4rem", height: "3.4rem" }}></div>}


                          </div>
                          <p className={styles.recentPostCaption}>{post.body}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>



              </div>
              <div className={styles.workHistory}>
                <h4>Work History</h4>

                <div className={styles.workHistoryContainerX}>
                  <div className={styles.workHistoryContainer}>
                    {
                      userProfile.pastWork.map((work, index) => {
                        return (
                          <div key={index} className={styles.workHistoryCard}>
                            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                              {work.company} - {work.position}
                            </p>
                            <p>{work.years}+</p>
                          </div>
                        )
                      })
                    }
                  </div>

                  <button className={styles.addWorkButton} onClick={() => {
                    setIsModalOpen(true)
                  }}>Add Work</button>
                </div>
              </div>

              <div className={styles.workHistory}>
                <h4>Education</h4>

                <div className={styles.workHistoryContainerX}>
                  <div className={styles.workHistoryContainer}>
                    {
                      userProfile.education.map((edu, index) => {
                        return (
                          <div key={index} className={styles.workHistoryCard}>
                            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                              {edu.school}
                            </p>
                            <p>{edu.degree} - {edu.fieldOfStudy}</p>
                          </div>
                        )
                      })
                    }
                  </div>

                  <button className={styles.addWorkButton} onClick={() => {
                    setIsEduModalOpen(true)
                  }}>Add Education</button>
                </div>
              </div>

              {userProfile != authState.user &&
                <div onClick={() => {
                  updateProfileData();
                }} className={styles.updateProfileBtn}>
                  Update Profile
                </div>
              }


            </div>


          </div>
        }

        {
          isModalOpen &&
          <div

            onClick={() => {
              setIsModalOpen(false)
            }}
            className={styles.commentsContainer}>

            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
              className={styles.allcommentsContainer}>

              <input
                onChange={handleWorkInputChange}
                name='company'
                className={styles.inputField}
                type="text"
                placeholder="Enter Company"
              />
              <input
                onChange={handleWorkInputChange}
                name='position'
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
              />
              <input
                onChange={handleWorkInputChange}
                name='years'
                className={styles.inputField}
                type="number"
                placeholder="Years"
              />

              <button
                onClick={() => {
                  setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] })
                  setIsModalOpen(false)
                }}
                className={styles.addwrkbtn}>
                Add Work
              </button>

            </div>

          </div>
        }

        {
          isEduModalOpen &&
          <div

            onClick={() => {
              setIsEduModalOpen(false)
            }}
            className={styles.commentsContainer}>

            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
              className={styles.allcommentsContainer}>

              <input
                onChange={handleEducationInputChange}
                name='school'
                className={styles.inputField}
                type="text"
                placeholder="Enter Your School"
              />
              <input
                onChange={handleEducationInputChange}
                name='degree'
                className={styles.inputField}
                type="text"
                placeholder="Enter Your Degree"
              />
              <input
                onChange={handleEducationInputChange}
                name='fieldOfStudy'
                className={styles.inputField}
                type="text"
                placeholder="Enter Your Field Of Study"
              />

              <button
                onClick={() => {
                  setUserProfile({ ...userProfile, education: [...userProfile.education, eduInputData] })
                  setIsEduModalOpen(false)
                }}
                className={styles.addwrkbtn}>
                Add Education
              </button>

            </div>

          </div>
        }


      </DashboardLayout>
    </UserLayout>
  )
}
