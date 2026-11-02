import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'
import { useSelector } from 'react-redux'
import styles from "./style.module.css"
import { useRouter } from 'next/router'
import { normalizePicture } from '@/utils/media'

// The current user and the user list are loaded by DashboardLayout
export default function DiscoverPage() {

  const authState = useSelector((state) => state.auth)

  const router = useRouter()

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
                  <img className={styles.userCard_img} src={normalizePicture(user.userId.profilePicture)} alt="profile" width={70} height={70} loading="lazy" decoding="async" />
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

