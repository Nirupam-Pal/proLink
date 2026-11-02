import { BASE_URL } from '@/config';
import { AcceptConnection, getConnectionsRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {


  const router = useRouter()
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(getMyConnectionRequests({ token })); // incoming requests (others -> me)
    dispatch(getConnectionsRequest({ token }));   // outgoing requests (me -> others)
  }, [])

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {

    }
  }, [authState.connectionRequest])

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
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <h3>My Connection Requests</h3>
          {authState.connectionRequest.length === 0 && <h2>No Connection Request Pending</h2>}

          {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
            return (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`)
                }}
                key={index}
                className={styles.userCard}
              >
                <div className={styles.profilePicture}>
                  <img
                    className={styles.userCard_image}
                    // src={`${BASE_URL}/${user.userId.profilePicture}`}
                    src={normalizePicture(user.userId.profilePicture)}
                    alt="dp"
                    style={{ width: "55px", height: "55px", borderRadius: "50%" }}
                  />
                </div>
                <div className={styles.userInfo} style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{user.userId.name}</h4>
                  <p style={{ margin: 0, color: "#888" }}>{user.userId.username}</p>
                </div>
                <button onClick={(e) => {
                  e.stopPropagation()

                  dispatch(AcceptConnection({
                    connectionId: user._id,
                    token: localStorage.getItem("token"),
                    action: "accept"
                  }))
                }} className={styles.connectedButton}>Accept</button>
              </div>
            )
          })}


          <h3>My Network</h3>
          {(() => {
            const acceptedIncoming = (authState.connectionRequest || [])
              .filter((c) => c.status_accepted === true)
              .map((c) => ({ other: c.userId }));

            const acceptedOutgoing = (authState.connections || [])
              .filter((c) => c.status_accepted === true)
              .map((c) => ({ other: c.connectionId }));

            const acceptedAll = [...acceptedIncoming, ...acceptedOutgoing];

            if (acceptedAll.length === 0) {
              return <h2>No Connections Yet</h2>;
            }

            return acceptedAll.map((conn, index) => {
              const u = conn.other;
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${u.username}`)
                  }}
                  key={index}
                  className={styles.userCard}
                >
                  <div className={styles.profilePicture}>
                    <img
                      className={styles.userCard_image}
                      src={normalizePicture(u.profilePicture)}
                      // src={`${BASE_URL}/${u.profilePicture}`}
                      alt="dp"
                      style={{ width: "55px", height: "55px", borderRadius: "50%" }}
                    />
                  </div>
                  <div className={styles.userInfo} style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{u.name}</h4>
                    <p style={{ margin: 0, color: "#888" }}>{u.username}</p>
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </DashboardLayout>


    </UserLayout>
  )
}
