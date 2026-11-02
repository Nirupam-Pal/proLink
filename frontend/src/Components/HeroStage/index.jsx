import Image from "next/image";
import { useEffect, useRef } from "react";
import { Avatar, PostPreview, ProfilePreview, people } from "@/Components/Landing/Previews";
import { icons, Icon } from "@/Components/Landing/icons";
import styles from "./styles.module.css";

// Layered 3D composition built from CSS transforms only (no WebGL): a profile card at the back,
// a feed post in the middle and two notifications in front. The stage tilts toward the pointer and
// each layer sits at a different depth, giving real parallax. Pointer tracking is skipped on touch
// devices and for reduced-motion users; the layers simply sit flat there.
export default function HeroStage() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    let frame = 0;
    let target = { x: 0, y: 0 };

    const apply = () => {
      frame = 0;
      stage.style.setProperty("--rx", `${(-target.y * 6).toFixed(2)}deg`);
      stage.style.setProperty("--ry", `${(target.x * 8).toFixed(2)}deg`);
    };

    const onMove = (e) => {
      const rect = stage.getBoundingClientRect();
      target = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      target = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const host = stage.parentElement;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.host}>
      <div ref={stageRef} className={styles.stage} role="img" aria-label="A ProLink post with likes, a profile card and a connection request">
        <div className={`${styles.layer} ${styles.back}`} aria-hidden="true">
          <ProfilePreview person={people[0]} compact />
        </div>

        <div className={`${styles.layer} ${styles.mid}`} aria-hidden="true">
          <PostPreview
            person={people[0]}
            body="Shipped my first open-source fix today. Small change, big lesson: read the issue twice."
            likes={41}
            autoLike
            media={
              // Hero is the LCP element: served resized as WebP/AVIF and preloaded
              <Image src="/images/img1.png" alt="" fill sizes="(max-width: 768px) 86vw, 340px" priority />
            }
          />
        </div>

        <div className={`${styles.layer} ${styles.chip} ${styles.chipRequest}`} aria-hidden="true">
          <Avatar person={people[1]} size={34} />
          <span className={styles.chipText}>
            <strong>{people[1].name}</strong>
            <small>wants to connect</small>
          </span>
          <span className={styles.accept}>
            <Icon d={icons.check} />
          </span>
        </div>

        <div className={`${styles.layer} ${styles.chip} ${styles.chipLike}`} aria-hidden="true">
          <span className={styles.likeBadge}>
            <Icon d={icons.like} />
          </span>
          <span className={styles.chipText}>
            <strong>{people[2].name}</strong>
            <small>liked your post</small>
          </span>
        </div>
      </div>
    </div>
  );
}
