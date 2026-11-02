import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

const NavbarComponent = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        {/* Brand always visible */}
        <h1
          className={styles.navh1}
          onClick={() => router.push("/")}
        >
          ProLink
        </h1>

        {/* Desktop options */}
        <div className={styles.navbarOptionsContainer}>
          {authState.profileFetched ? (
            <div className={styles.profile}>
              <p
                onClick={() => router.push("/profile")}
                className={styles.proP}
              >
                Profile
              </p>
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                className={styles.buttonNav}
              >
                Logout
              </p>
            </div>
          ) : (
            <div
              className={styles.buttonNav}
              onClick={() => router.push("/login")}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className={styles.hamburger}
          aria-label="Toggle menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        {authState.profileFetched ? (
          <div className={styles.mobileActions}>
            <p
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className={styles.menuItem}
            >
              Profile
            </p>
            <p
              onClick={() => {
                localStorage.removeItem("token");
                setIsOpen(false);
                router.push("/login");
                dispatch(reset());
              }}
              className={styles.menuItem}
            >
              Logout
            </p>
          </div>
        ) : (
          <div
            className={styles.menuItem}
            onClick={() => {
              setIsOpen(false);
              router.push("/login");
            }}
          >
            Be a part
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarComponent;
