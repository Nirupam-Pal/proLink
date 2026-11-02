import React, { useEffect } from "react";
import styles from './styles.module.css'
import { useRouter } from "next/router";
import { setTokenIsThere, setTokenIsNotThere } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { normalizePicture } from "@/utils/media";

const navItems = [
    {
        href: "/dashboard",
        label: "Scroll",
        icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
    },
    {
        href: "/discover",
        label: "Discover",
        icon: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
    },
    {
        href: "/my_connections",
        label: "My Connections",
        icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    },
];

const TOP_PROFILES_SHOWN = 8;

function NavIcon({ d }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

export default function DashboardLayout({ children }) {

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            dispatch(setTokenIsNotThere());
            router.push("/login");
        } else {
            dispatch(setTokenIsThere());
            if (!authState.profileFetched) {
                dispatch(getAboutUser({ token }));
            }
            if (!authState.all_profiles_fetched) {
                dispatch(getAllUsers());
            }
        }
    }, []);

    // Sidebar items navigate with router.push, which (unlike <Link>) doesn't prefetch
    useEffect(() => {
        ["/dashboard", "/discover", "/my_connections", "/profile"].forEach((route) => router.prefetch(route));
    }, []);

    const me = authState.user?.userId;
    const topProfiles = authState.all_profiles_fetched
        ? authState.all_users.filter((profile) => profile.userId)
        : [];

    return (
        <div className={styles.shell}>
            <div className={styles.homeContainer}>

                <aside className={styles.leftBar}>
                    <div className={styles.sticky}>
                        {me ? (
                            <button type="button" className={styles.meCard} onClick={() => router.push("/profile")}>
                                <img className="avatar" src={normalizePicture(me.profilePicture, 96)} alt="" width={40} height={40} />
                                <span className={styles.meText}>
                                    <strong>{me.name}</strong>
                                    <small>@{me.username}</small>
                                </span>
                            </button>
                        ) : (
                            <div className={styles.meCard} aria-hidden="true">
                                <span className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                                <span className={styles.meText}>
                                    <span className="skeleton" style={{ width: 96, height: 12 }} />
                                    <span className="skeleton" style={{ width: 64, height: 10, marginTop: 6 }} />
                                </span>
                            </div>
                        )}

                        <nav className={styles.sideNav} aria-label="Main">
                            {navItems.map((item) => {
                                const active = router.pathname === item.href;
                                return (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() => {
                                            router.push(item.href)
                                        }}
                                        className={`${styles.sideBarOption} ${active ? styles.active : ""}`}
                                        aria-current={active ? "page" : undefined}
                                    >
                                        <NavIcon d={item.icon} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <main className={styles.feedContainer}>
                    {children}
                </main>

                <aside className={styles.extraContainer}>
                    <div className={styles.sticky}>
                        <div className={styles.railCard}>
                            <h3 className={styles.railTitle}>Top Profiles</h3>

                            {!authState.all_profiles_fetched && (
                                <ul className={styles.railList} aria-hidden="true">
                                    {[0, 1, 2, 3].map((i) => (
                                        <li key={i} className={styles.railItem}>
                                            <span className="skeleton" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                                            <span className="skeleton" style={{ width: 110, height: 12 }} />
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <ul className={styles.railList}>
                                {topProfiles.slice(0, TOP_PROFILES_SHOWN).map((profile) => (
                                    <li key={profile._id}>
                                        <button
                                            type="button"
                                            className={styles.railItem}
                                            onClick={() => router.push(`/view_profile/${profile.userId.username}`)}
                                        >
                                            <img className="avatar" src={normalizePicture(profile.userId.profilePicture, 64)} alt="" width={32} height={32} loading="lazy" decoding="async" />
                                            <span className={styles.railName}>{profile.userId.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {topProfiles.length > TOP_PROFILES_SHOWN && (
                                <button type="button" className={styles.railMore} onClick={() => router.push("/discover")}>
                                    See everyone →
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            <nav className={styles.mobileNavbar} aria-label="Main">
                {navItems.map((item) => {
                    const active = router.pathname === item.href;
                    return (
                        <button
                            key={item.href}
                            type="button"
                            onClick={() => {
                                router.push(item.href)
                            }}
                            className={`${styles.singleNavItemHolder_mobileView} ${active ? styles.mobileActive : ""}`}
                            aria-current={active ? "page" : undefined}
                        >
                            <NavIcon d={item.icon} />
                            <span>{item.label === "My Connections" ? "Network" : item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
