import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";
import HeroStage from "@/Components/HeroStage";
import Footer from "@/Components/Footer";
import Reveal, { useInView, useScrollProgress, WordReveal } from "@/Components/Reveal";
import {
  Avatar,
  ComposerPreview,
  Frame,
  PeoplePreview,
  PostPreview,
  ProfilePreview,
  RequestsPreview,
  ScreenHead,
  people,
} from "@/Components/Landing/Previews";
import { icons, Icon } from "@/Components/Landing/icons";

// Everything listed here exists in the app today
const capabilities = [
  "Text & photo posts",
  "Likes",
  "Comments",
  "Discover people",
  "Connection requests",
  "Work history",
  "Education",
  "Profile photos",
  "PDF résumés",
];

const intro =
  "Most networks reward the loudest highlight reel. ProLink is built for the honest version: real posts, real people, and a profile that shows the work you've actually done.";

const feedScreen = (
  <div className={styles.screenStack}>
    <ScreenHead title="Scroll" sub="See what your network is sharing" />
    <ComposerPreview />
    <PostPreview
      person={people[4]}
      time="1h"
      body="Our team wrapped the campus hackathon today. Proud of everyone who showed up and shipped."
      likes={18}
      liked
      media={<Image src="/images/img1.png" alt="" fill sizes="(max-width: 900px) 80vw, 420px" />}
    />
  </div>
);

const chapters = [
  {
    title: "Scroll",
    path: "dashboard",
    href: "/dashboard",
    body: "Share what you're working on with text and a photo. Like a post once, tap again to take it back, and keep the conversation going in the comments.",
    points: ["Text & photo posts", "One like per person", "Comments on every post"],
    screen: feedScreen,
  },
  {
    title: "Discover",
    path: "discover",
    href: "/discover",
    body: "Browse everyone on ProLink and open any profile in a tap, with their bio, work history and education, before you connect.",
    points: ["Everyone in one place", "Full public profiles"],
    screen: (
      <>
        <ScreenHead title="Discover" sub="People on ProLink" />
        <PeoplePreview />
      </>
    ),
  },
  {
    title: "My Connections",
    path: "my_connections",
    href: "/my_connections",
    body: "Send a request from someone's profile. Accept the ones that matter and keep your network in one tidy list.",
    points: ["Requests you approve", "Your network at a glance"],
    screen: (
      <>
        <ScreenHead title="My Connections" sub="Requests and the people you know" />
        <RequestsPreview />
      </>
    ),
  },
  {
    title: "Profile",
    path: "profile",
    href: "/profile",
    body: "Add a photo, a bio, your work and your education. Anyone visiting your profile can download it as a PDF résumé.",
    points: ["Work history & education", "One-click PDF résumé"],
    screen: <ProfilePreview person={people[0]} />,
  },
];

const steps = [
  { title: "Sign up", body: "Pick a username and you're in." },
  { title: "Build your profile", body: "Add a photo, a bio, your work and your education." },
  { title: "Connect", body: "Find people you know and grow a network that's real." },
];

const values = [
  { title: "Likes that count", body: "One per person, so the number actually means something." },
  { title: "Comments in context", body: "Every reply lives with the post it's about." },
  { title: "Connections by consent", body: "Nobody joins your network until you accept." },
];

const comments = [
  { person: people[1], body: "Congrats! Which issue was it?" },
  { person: people[3], body: "Reading the issue twice is underrated advice." },
  { person: people[4], body: "Saving this for my next PR." },
];

const Arrow = () => (
  <svg className="btn-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Words brighten one by one as the paragraph scrolls through the viewport (CSS reads --p)
function IntroStatement() {
  const ref = useScrollProgress({ start: 0.85, end: 0.55 });
  const words = intro.split(" ");

  return (
    <p ref={ref} className={`display ${styles.introText}`} style={{ "--n": words.length }}>
      {words.map((word, i) => (
        <span key={i} className={styles.introWord} style={{ "--i": i }}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

// Product tour: the text chapters scroll past a sticky app window that swaps to the matching screen.
// On narrow screens each chapter shows its own screen inline instead.
function Showcase() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      // A thin band across the middle of the screen decides which chapter is current
      { rootMargin: "-45% 0px -45% 0px" }
    );
    chapterRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.showcase}>
      <ol className={styles.chapters}>
        {chapters.map((c, i) => (
          <li
            key={c.title}
            ref={(node) => (chapterRefs.current[i] = node)}
            data-index={i}
            className={`${styles.chapter} ${active === i ? styles.chapterActive : ""}`}
          >
            <span className={styles.chapterNo}>0{i + 1}</span>
            <h3 className={styles.chapterTitle}>{c.title}</h3>
            <p className={styles.chapterBody}>{c.body}</p>
            <ul className={styles.points}>
              {c.points.map((point) => (
                <li key={point}>
                  <Icon d={icons.check} />
                  {point}
                </li>
              ))}
            </ul>
            <Link href={c.href} className={styles.chapterLink}>
              Open {c.title}
              <Icon d={icons.arrow} />
            </Link>

            <div className={styles.inlineScreen} aria-hidden="true">
              <Frame path={c.path}>{c.screen}</Frame>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.screenCol} aria-hidden="true">
        <div className={styles.screenSticky}>
          <Frame path={chapters[active].path}>
            <div className={styles.screens}>
              {chapters.map((c, i) => (
                <div key={c.title} className={`${styles.screen} ${active === i ? styles.screenActive : ""}`}>
                  {c.screen}
                </div>
              ))}
            </div>
          </Frame>
          <div className={styles.progressDots}>
            {chapters.map((c, i) => (
              <span key={c.title} className={active === i ? styles.dotActive : ""} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Steps() {
  const [ref, inView] = useInView({ threshold: 0.35 });

  return (
    <ol ref={ref} className={`${styles.steps} ${inView ? styles.stepsVisible : ""}`}>
      {steps.map((step, i) => (
        <li key={step.title} className={styles.step} style={{ "--i": i }}>
          <span className={styles.stepNo}>{i + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

// A post with its comment thread; the like button is a small local demo of the real interaction
function Thread() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [liked, setLiked] = useState(false);

  return (
    <div ref={ref} className={`${styles.thread} ${inView ? styles.threadVisible : ""}`}>
      <PostPreview
        person={people[0]}
        time="2h"
        body="Shipped my first open-source fix today. Small change, big lesson: read the issue twice."
        likes={liked ? 42 : 41}
        liked={liked}
        className={styles.threadPost}
      />
      <button
        type="button"
        className={`${styles.tryLike} ${liked ? styles.tryLikeOn : ""}`}
        onClick={() => setLiked((v) => !v)}
        aria-pressed={liked}
      >
        <Icon d={icons.like} />
        {liked ? "Liked. Tap again to undo" : "Try it: like this post"}
      </button>

      <ul className={styles.comments} aria-label="Sample comments">
        {comments.map((c, i) => (
          <li key={c.person.handle} className={styles.comment} style={{ "--i": i }}>
            <Avatar person={c.person} size={30} />
            <span>
              <strong>{c.person.name}</strong>
              {c.body}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Two linked rings (the logo mark) that draw themselves as the closing section scrolls in
function ClosingRings() {
  return (
    <svg className={styles.rings} viewBox="0 0 400 240" aria-hidden="true">
      <circle cx="150" cy="120" r="104" pathLength="1" />
      <circle cx="250" cy="120" r="104" pathLength="1" className={styles.ringAccent} />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const heroRef = useScrollProgress({ start: 0.1, end: 0 });
  const closingRef = useScrollProgress({ start: 1, end: 0.6 });
  const join = () => router.push("/login");

  return (
    <UserLayout>
      <Head>
        <title>ProLink — Connect with Friends without Exaggeration</title>
      </Head>

      <main>
        {/* Hero */}
        <div ref={heroRef} className={styles.heroWrap}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} />
                The honest professional network
              </p>
              <WordReveal
                as="h1"
                className={`display ${styles.heroTitle}`}
                text="Connect with Friends without Exaggeration"
                accent={["without", "Exaggeration"]}
                immediate
              />
              <p className={styles.heroLede}>
                A True social media platform, with stories, no blufs! Share posts, find the people you know, and keep
                your work history in one place.
              </p>
              <div className={styles.heroActions}>
                <button type="button" onClick={join} className="btn btn-accent">
                  Join Now
                  <Arrow />
                </button>
                <a href="#inside" className="btn btn-ghost">
                  See inside
                </a>
              </div>
              <ul className={styles.heroMeta}>
                {["Free to join", "Posts, likes & comments", "Résumé-ready profiles"].map((item) => (
                  <li key={item}>
                    <Icon d={icons.check} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.heroVisual}>
              <HeroStage />
            </div>
          </section>
        </div>

        {/* Capabilities strip */}
        <section className={styles.marquee} aria-label="What you can do on ProLink">
          <ul className={styles.marqueeTrack}>
            {[0, 1].map((copy) =>
              capabilities.map((item) => (
                <li key={`${copy}-${item}`} aria-hidden={copy === 1 || undefined}>
                  {item}
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Introduction */}
        <section id="about" className={styles.intro}>
          <p className="eyebrow">Why ProLink</p>
          <IntroStatement />
        </section>

        {/* Product tour */}
        <section id="inside" className={styles.inside}>
          <div className={styles.insideHead}>
            <p className="eyebrow">Inside ProLink</p>
            <WordReveal
              className={`display ${styles.sectionTitle}`}
              text="Four places, one honest network."
              accent={["honest"]}
            />
          </div>
          <Showcase />
        </section>

        {/* How it works */}
        <section id="how" className={styles.how}>
          <div className={styles.howHead}>
            <div>
              <p className="eyebrow">How it works</p>
              <WordReveal className={`display ${styles.sectionTitle}`} text="Three steps to a real network." accent={["real"]} />
            </div>
            <button type="button" onClick={join} className={`btn btn-accent ${styles.howCta}`}>
              Create your account
              <Arrow />
            </button>
          </div>
          <Steps />
        </section>

        {/* Community */}
        <section id="community" className={styles.community}>
          <div className={styles.communityInner}>
            <div className={styles.communityCopy}>
              <p className={`eyebrow ${styles.eyebrowLight}`}>Community</p>
              <WordReveal
                className={`display ${styles.sectionTitle} ${styles.communityTitle}`}
                text="Conversations, not broadcasts."
                accent={["not"]}
              />
              <Reveal as="p" className={styles.communityLede}>
                Every post on ProLink is a place to talk. Like, comment, and connect with the people behind the posts,
                not their follower counts.
              </Reveal>
              <ul className={styles.values}>
                {values.map((v, i) => (
                  <Reveal as="li" key={v.title} delay={i * 90} className={styles.value}>
                    <span className={styles.valueNo}>0{i + 1}</span>
                    <span>
                      <strong>{v.title}</strong>
                      {v.body}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Thread />
          </div>
        </section>

        {/* Closing call to action */}
        <section ref={closingRef} className={styles.closing}>
          <ClosingRings />
          <div className={styles.closingInner}>
            <p className="eyebrow">Join the community</p>
            <WordReveal
              as="h2"
              className={`display ${styles.closingTitle}`}
              text="Your story, without the exaggeration."
              accent={["without"]}
            />
            <Reveal as="p" className={styles.closingLede}>
              A True social media platform, with stories, no blufs!
            </Reveal>
            <Reveal className={styles.closingActions} delay={120}>
              <button type="button" onClick={join} className="btn btn-accent">
                Join Now
                <Arrow />
              </button>
              <a href="#inside" className="btn btn-ghost">
                Take the tour
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </UserLayout>
  );
}
