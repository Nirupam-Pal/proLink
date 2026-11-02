import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

// In-page sections of the landing page, shown in the navbar only there
const landingLinks = [
  { href: "#inside", label: "Product" },
  { href: "#how", label: "How it works" },
  { href: "#community", label: "Community" },
];

export function Logo({ onClick }) {
  return (
    <button type="button" className={styles.brand} onClick={onClick} aria-label="ProLink home">
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="12" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="20" cy="16" r="7.5" fill="none" stroke="var(--accent)" strokeWidth="2.4" />
      </svg>
      <span className={styles.wordmark}>
        Pro<em>Link</em>
      </span>
    </button>
  );
}

const NavbarComponent = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Only re-render when the threshold is crossed, not on every scroll event
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    router.push("/login");
    dispatch(reset());
  };

  const isProfile = router.pathname === "/profile";
  const isLanding = router.pathname === "/";

  return (
    <header className={`${styles.container} ${scrolled || isOpen ? styles.scrolled : ""}`}>
      <nav className={styles.navbar}>
        <Logo onClick={() => router.push("/")} />

        {/* Desktop options */}
        <div className={styles.navbarOptionsContainer}>
          {isLanding && (
            <div className={styles.sectionLinks}>
              {landingLinks.map((link) => (
                <a key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              ))}
            </div>
          )}
          {authState.profileFetched ? (
            <div className={styles.profile}>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className={`${styles.navLink} ${isProfile ? styles.active : ""}`}
                aria-current={isProfile ? "page" : undefined}
              >
                Profile
              </button>
              <button type="button" onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-accent btn-sm" onClick={() => router.push("/login")}>
              Be a part
              <svg className="btn-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          type="button"
          className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        {isLanding && (
          <div className={styles.mobileActions}>
            {landingLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.menuItem} onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        )}
        {authState.profileFetched ? (
          <div className={styles.mobileActions}>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className={styles.menuItem}
            >
              Profile
            </button>
            <button type="button" onClick={logout} className={styles.menuItem}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.mobileActions}>
            <button
              type="button"
              className={`btn btn-accent ${styles.menuCta}`}
              onClick={() => {
                setIsOpen(false);
                router.push("/login");
              }}
            >
              Be a part
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarComponent;
