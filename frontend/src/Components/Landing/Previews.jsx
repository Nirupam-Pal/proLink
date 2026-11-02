import { icons, Icon } from "./icons";
import styles from "./Previews.module.css";

// Scaled-down replicas of real ProLink screens (feed, Discover, My Connections, Profile).
// They are illustrations only: parents mark them aria-hidden and nothing inside is focusable.

// Warm tones taken from the network illustration, plus the brand cobalt
const tones = ["#e27a4c", "#4f8a8b", "#e0a63a", "#a65136", "#0b3c49", "#2b3fd6"];

export const people = [
  { name: "Ananya Rao", handle: "ananya", tone: 5 },
  { name: "Kabir Sen", handle: "kabir.sen", tone: 1 },
  { name: "Meera Iyer", handle: "meera", tone: 0 },
  { name: "Rohan Das", handle: "rohandas", tone: 4 },
  { name: "Ishita Paul", handle: "ishita", tone: 2 },
  { name: "Arjun Nair", handle: "arjun.n", tone: 3 },
];

export function Avatar({ person, size = 32, className = "" }) {
  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <span
      className={`${styles.avatar} ${className}`}
      style={{ "--tone": tones[person.tone % tones.length], "--size": `${size}px` }}
    >
      {initials}
    </span>
  );
}

// A feed post. `autoLike` plays a looping like (count rolls up, icon fills) for the hero.
export function PostPreview({ person = people[0], time = "2h", body, media, likes = 41, liked = false, autoLike = false, className = "" }) {
  return (
    <article className={`${styles.post} ${autoLike ? styles.autoLike : ""} ${className}`}>
      <header className={styles.postHead}>
        <Avatar person={person} size={36} />
        <span className={styles.who}>
          <strong>{person.name}</strong>
          <small>
            @{person.handle} · {time}
          </small>
        </span>
      </header>

      <p className={styles.postBody}>{body}</p>

      {media && <div className={styles.postMedia}>{media}</div>}

      <footer className={styles.postActions}>
        <span className={`${styles.act} ${liked ? styles.actOn : ""} ${styles.likeAct}`}>
          <Icon d={icons.like} />
          {autoLike ? (
            <span className={styles.roll}>
              <span>{likes}</span>
              <span>{likes + 1}</span>
            </span>
          ) : (
            <span>{likes}</span>
          )}
        </span>
        <span className={styles.act}>
          <Icon d={icons.comment} />
          Comment
        </span>
        <span className={styles.act}>
          <Icon d={icons.share} />
          Share
        </span>
      </footer>
    </article>
  );
}

export function ComposerPreview() {
  return (
    <div className={styles.composer}>
      <Avatar person={people[3]} size={30} />
      <span className={styles.composerField}>What&apos;s on your mind?</span>
      <span className={styles.composerPhoto}>
        <Icon d={icons.image} />
      </span>
      <span className={styles.miniBtn}>Post</span>
    </div>
  );
}

export function PeoplePreview() {
  return (
    <div className={styles.people}>
      {people.map((p) => (
        <span key={p.handle} className={styles.personCard}>
          <Avatar person={p} size={44} />
          <strong>{p.name}</strong>
          <small>@{p.handle}</small>
          <em>View profile →</em>
        </span>
      ))}
    </div>
  );
}

export function RequestsPreview() {
  return (
    <div className={styles.requests}>
      <p className={styles.listTitle}>
        My Connection Requests <span className={styles.badge}>2</span>
      </p>
      {people.slice(1, 3).map((p) => (
        <span key={p.handle} className={styles.row}>
          <Avatar person={p} size={36} />
          <span className={styles.who}>
            <strong>{p.name}</strong>
            <small>@{p.handle}</small>
          </span>
          <span className={styles.miniBtn}>Accept</span>
        </span>
      ))}

      <p className={styles.listTitle}>My Network</p>
      {people.slice(3, 5).map((p) => (
        <span key={p.handle} className={styles.row}>
          <Avatar person={p} size={36} />
          <span className={styles.who}>
            <strong>{p.name}</strong>
            <small>@{p.handle}</small>
          </span>
          <span className={styles.tag}>
            <Icon d={icons.check} />
            Connected
          </span>
        </span>
      ))}
    </div>
  );
}

// `compact` drops the bio and education for the small hero card
export function ProfilePreview({ person = people[0], compact = false }) {
  return (
    <div className={`${styles.profile} ${compact ? styles.profileCompact : ""}`}>
      <span className={styles.cover} />
      <span className={styles.profileHead}>
        <Avatar person={person} size={compact ? 56 : 68} className={styles.profileAvatar} />
        <span className={styles.profileBtns}>
          <span className={styles.miniBtn}>Connect</span>
          {!compact && (
            <span className={`${styles.miniBtn} ${styles.miniGhost}`}>
              <Icon d={icons.download} />
              Résumé
            </span>
          )}
        </span>
      </span>
      <span className={styles.profileName}>{person.name}</span>
      <small className={styles.profileHandle}>@{person.handle}</small>
      {!compact && <p className={styles.bio}>Frontend developer. I write about the bugs I fix and the things I learn.</p>}

      <p className={styles.blockTitle}>Work History</p>
      <span className={styles.timeline}>
        <span>
          <strong>Frontend Developer</strong>
          <small>Lumen Labs · 2024 – Present</small>
        </span>
        {!compact && (
          <span>
            <strong>Web Intern</strong>
            <small>Northwind Studio · 2023</small>
          </span>
        )}
      </span>

      {!compact && (
        <>
          <p className={styles.blockTitle}>Education</p>
          <span className={styles.timeline}>
            <span>
              <strong>B.Tech, Computer Science</strong>
              <small>2020 – 2024</small>
            </span>
          </span>
        </>
      )}
    </div>
  );
}

// Page title and subtitle, styled like the real app's page heads
export function ScreenHead({ title, sub }) {
  return (
    <span className={styles.screenHead}>
      <strong>{title}</strong>
      <small>{sub}</small>
    </span>
  );
}

// Browser-style frame for the product showcase; `path` is the app route on display
export function Frame({ path, children }) {
  return (
    <div className={styles.frame}>
      <div className={styles.frameBar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>prolink / {path}</span>
      </div>
      <div className={styles.frameBody}>{children}</div>
    </div>
  );
}
