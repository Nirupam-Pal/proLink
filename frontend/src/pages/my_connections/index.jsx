import { AcceptConnection, getConnectionsRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';
import { normalizePicture } from '@/utils/media';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { useRouter } from 'next/router';

function PersonRow({ person, onOpen, children, index }) {
  return (
    <li
      className={styles.userCard}
      style={{ "--stagger": `${Math.min(index, 8) * 40}ms` }}
    >
      <button type="button" className={styles.person} onClick={onOpen}>
        <img
          className={`avatar ${styles.userCard_image}`}
          src={normalizePicture(person.profilePicture, 112)}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
        />
        <span className={styles.userInfo}>
          <span className={styles.name}>{person.name}</span>
          <span className={styles.handle}>@{person.username}</span>
        </span>
      </button>
      {children}
    </li>
  );
}

export default function MyConnectionsPage() {


  const router = useRouter()
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(getMyConnectionRequests({ token })); // incoming requests (others -> me)
    dispatch(getConnectionsRequest({ token }));   // outgoing requests (me -> others)
  }, [])

  // A request whose other user has since been deleted comes back with that user as null; skip it
  const pending = (authState.connectionRequest || []).filter((connection) => connection.status_accepted === null && connection.userId);

  const acceptedIncoming = (authState.connectionRequest || [])
    .filter((c) => c.status_accepted === true && c.userId)
    .map((c) => ({ other: c.userId }));

  const acceptedOutgoing = (authState.connections || [])
    .filter((c) => c.status_accepted === true && c.connectionId)
    .map((c) => ({ other: c.connectionId }));

  const acceptedAll = [...acceptedIncoming, ...acceptedOutgoing];

  return (
    <UserLayout>
      <DashboardLayout>
        <header className={styles.pageHead}>
          <h1 className={`display ${styles.pageTitle}`}>My Connections</h1>
          <p className={styles.pageSub}>Requests waiting on you, and the people you're connected with.</p>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>My Connection Requests</h2>
            {pending.length > 0 && <span className={styles.count}>{pending.length}</span>}
          </div>

          {pending.length === 0 ? (
            <p className={styles.empty}>No Connection Request Pending</p>
          ) : (
            <ul className={styles.list}>
              {pending.map((user, index) => (
                <PersonRow
                  key={user._id || index}
                  index={index}
                  person={user.userId}
                  onOpen={() => {
                    router.push(`/view_profile/${user.userId.username}`)
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()

                      dispatch(AcceptConnection({
                        connectionId: user._id,
                        token: localStorage.getItem("token"),
                        action: "accept"
                      }))
                    }}
                    className="btn btn-accent btn-sm"
                  >
                    Accept
                  </button>
                </PersonRow>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>My Network</h2>
            {acceptedAll.length > 0 && <span className={styles.countMuted}>{acceptedAll.length}</span>}
          </div>

          {acceptedAll.length === 0 ? (
            <p className={styles.empty}>No Connections Yet</p>
          ) : (
            <ul className={styles.list}>
              {acceptedAll.map((conn, index) => {
                const u = conn.other;
                return (
                  <PersonRow
                    key={index}
                    index={index}
                    person={u}
                    onOpen={() => {
                      router.push(`/view_profile/${u.username}`)
                    }}
                  >
                    <span className={styles.connectedTag}>Connected</span>
                  </PersonRow>
                )
              })}
            </ul>
          )}
        </section>
      </DashboardLayout>
    </UserLayout>
  )
}
