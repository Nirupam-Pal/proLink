import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function DiscoverPage() {

  const authState = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers())
    }
    if (!authState.profileFetched) {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    }
  }, [])

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

  return (
    <UserLayout>

      <DashboardLayout>
        <div>
          <h1 style={{ textAlign: "center" }}>Discover</h1>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && (authState.user ? authState.all_users.filter((u) => u.userId._id && authState.user?.userId?._id && u.userId._id !== authState.user.userId._id) : authState.all_users).map((user) => {
              return (
                <div onClick={() => {
                  router.push(`/view_profile/${user.userId?.username}`)
                }} key={user._id} className={styles.userCard}>
                  <img className={styles.userCard_img} src={normalizePicture(user.userId.profilePicture)} alt="profile" />
                  <div>
                    <h1>{user.userId?.name || "unknown"}</h1>
                    <p>{user.userId?.username || "unknown"}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DashboardLayout>
{/* rc={normalizePicture(user.userId.profilePicture)} */}

    </UserLayout>
  )
}

