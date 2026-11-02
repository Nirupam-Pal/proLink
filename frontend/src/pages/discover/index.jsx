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

  const people = authState.all_profiles_fetched
    ? (authState.user
        ? authState.all_users.filter((u) => u.userId?._id && authState.user?.userId?._id && u.userId._id !== authState.user.userId._id)
        : authState.all_users.filter((u) => u.userId))
    : [];

  return (
    <UserLayout>
      <DashboardLayout>
        <header className={styles.pageHead}>
          <h1 className={`display ${styles.pageTitle}`}>Discover</h1>
          <p className={styles.pageSub}>
            {authState.all_profiles_fetched ? `${people.length} people on ProLink` : "Finding people…"}
          </p>
        </header>

        <div className={styles.allUserProfile}>
          {!authState.all_profiles_fetched &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.userCard} aria-hidden="true">
                <span className="skeleton" style={{ width: 64, height: 64, borderRadius: "50%" }} />
                <span className="skeleton" style={{ width: "70%", height: 14, marginTop: 16 }} />
                <span className="skeleton" style={{ width: "45%", height: 11, marginTop: 8 }} />
              </div>
            ))}

          {people.map((user, i) => {
            return (
              <button
                type="button"
                onClick={() => {
                  router.push(`/view_profile/${user.userId?.username}`)
                }}
                key={user._id}
                className={styles.userCard}
                style={{ "--stagger": `${Math.min(i, 9) * 40}ms` }}
              >
                <img className={`avatar ${styles.userCard_img}`} src={normalizePicture(user.userId.profilePicture, 160)} alt="" width={64} height={64} loading="lazy" decoding="async" />
                <span className={styles.name}>{user.userId?.name || "unknown"}</span>
                <span className={styles.handle}>@{user.userId?.username || "unknown"}</span>
                <span className={styles.view}>
                  View profile
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
