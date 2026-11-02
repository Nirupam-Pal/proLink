import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import HeroStage from "@/Components/HeroStage";
import Footer from "@/Components/Footer";
import Reveal, { useInView, WordReveal } from "@/Components/Reveal";

const features = [
  {
    no: "01",
    title: "Scroll",
    body: "Share posts with images, react with a like, and talk it through in the comments.",
  },
  {
    no: "02",
    title: "Discover",
    body: "Browse the people on ProLink and open anyone's profile in a tap.",
  },
  {
    no: "03",
    title: "My Connections",
    body: "Send requests, accept the ones that matter, and keep your network in one place.",
  },
  {
    no: "04",
    title: "Profile",
    body: "Your work history and education on one page, ready to download as a résumé.",
  },
];

const steps = [
  { title: "Sign up", body: "Pick a username and you're in." },
  { title: "Build your profile", body: "Add a photo, a bio, your work and your education." },
  { title: "Connect", body: "Find people you know and grow a network that's real." },
];

const Arrow = () => (
  <svg className="btn-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>ProLink — Connect with Friends without Exaggeration</title>
      </Head>

      <main>
        {/* Hero */}
        <div className={styles.heroWrap}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={`eyebrow ${styles.heroEyebrow}`}>The honest professional network</p>
            <WordReveal
              as="h1"
              className={`display ${styles.heroTitle}`}
              text="Connect with Friends without Exaggeration"
              accent={["without", "Exaggeration"]}
              immediate
            />
            <p className={styles.heroLede}>A True social media platform, with stories, no blufs!</p>
            <div className={styles.heroActions}>
              <button type="button" onClick={() => router.push("/login")} className="btn btn-accent">
                Join Now
                <Arrow />
              </button>
              <a href="#how" className="btn btn-ghost">
                How it works
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <HeroStage />
          </div>
        </section>
        </div>

        {/* Features: sticky heading beside an editorial list */}
        <section id="features" className={styles.features}>
          <div className={styles.featuresHead}>
            <p className="eyebrow">Inside ProLink</p>
            <WordReveal
              className={`display ${styles.sectionTitle}`}
              text="Four places, one honest network."
              accent={["honest"]}
            />
          </div>

          <ul className={styles.featureList}>
            {features.map((f, i) => (
              <Reveal as="li" key={f.no} delay={i * 80} className={styles.feature}>
                <span className={styles.featureNo}>{f.no}</span>
                <div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureBody}>{f.body}</p>
                </div>
                <svg className={styles.featureArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section id="how" className={styles.how}>
          <div className={styles.howHead}>
            <p className="eyebrow">How it works</p>
            <WordReveal className={`display ${styles.sectionTitle}`} text="Three steps to a real network." accent={["real"]} />
          </div>
          <Steps />
        </section>

        {/* Closing statement */}
        <section className={styles.closing}>
          <Reveal className={styles.closingInner}>
            <p className={`display ${styles.closingQuote}`}>
              A True social media platform, with <em>stories</em>, no blufs!
            </p>
            <button type="button" onClick={() => router.push("/login")} className="btn btn-accent">
              Join Now
              <Arrow />
            </button>
          </Reveal>
        </section>
      </main>

      <Footer />
    </UserLayout>
  );
}
