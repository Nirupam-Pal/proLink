import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

// Layered 3D composition built from CSS transforms only (no WebGL): the stage tilts
// toward the pointer and each layer sits at a different depth, giving real parallax.
// Pointer tracking is skipped on touch devices and for reduced-motion users.
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
      stage.style.setProperty("--rx", `${(-target.y * 7).toFixed(2)}deg`);
      stage.style.setProperty("--ry", `${(target.x * 9).toFixed(2)}deg`);
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
      <div ref={stageRef} className={styles.stage}>
        <div className={`${styles.layer} ${styles.plate}`} aria-hidden="true">
          <span className={styles.ring} />
          <span className={`${styles.ring} ${styles.ring2}`} />
        </div>

        <div className={`${styles.layer} ${styles.art}`}>
          {/* Hero is the LCP element: served resized as WebP/AVIF and preloaded */}
          <Image
            src="/images/img1.png"
            alt="People connected in a network"
            width={480}
            height={480}
            sizes="(max-width: 480px) 80vw, (max-width: 1024px) 360px, 460px"
            priority
          />
        </div>

        <div className={`${styles.layer} ${styles.chip} ${styles.chipA}`} aria-hidden="true">
          <span className={styles.chipDot} />
          <span>
            <strong>New connection</strong>
            <small>Request accepted</small>
          </span>
        </div>

        <div className={`${styles.layer} ${styles.chip} ${styles.chipB}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904" />
          </svg>
          <span>
            <strong>Recent Activity</strong>
            <small>Stories, no blufs</small>
          </span>
        </div>
      </div>
    </div>
  );
}
