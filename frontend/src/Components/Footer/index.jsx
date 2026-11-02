import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "@/Components/Navbar";
import styles from "./styles.module.css";

const groups = [
  {
    title: "On this page",
    links: [
      { href: "/#about", label: "Why ProLink" },
      { href: "/#inside", label: "Product tour" },
      { href: "/#how", label: "How it works" },
      { href: "/#community", label: "Community" },
    ],
  },
  {
    title: "Network",
    links: [
      { href: "/dashboard", label: "Scroll" },
      { href: "/discover", label: "Discover" },
      { href: "/my_connections", label: "My Connections" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Join ProLink" },
      { href: "/profile", label: "Your profile" },
    ],
  },
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Logo onClick={() => router.push("/")} />
          <p className={styles.tagline}>A True social media platform, with stories, no blufs!</p>
          <button type="button" className={`btn btn-accent btn-sm ${styles.cta}`} onClick={() => router.push("/login")}>
            Join ProLink
          </button>
        </div>

        {groups.map((group) => (
          <nav key={group.title} className={styles.col} aria-label={group.title}>
            <p className={styles.colTitle}>{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Oversized wordmark, cropped by the page edge */}
      <p className={styles.wordmark} aria-hidden="true">
        Pro<em>Link</em>
      </p>

      <div className={styles.base}>
        <p>© {new Date().getFullYear()} ProLink</p>
        <p className={styles.motto}>
          Connect with Friends <em>without Exaggeration</em>
        </p>
      </div>
    </footer>
  );
}
