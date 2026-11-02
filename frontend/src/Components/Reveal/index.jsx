import React, { useEffect, useRef, useState } from "react";

// Adds `is-visible` once the element scrolls into view, then stops observing.
// Content is server-rendered and visible to crawlers; only the transition waits.
export function useInView({ rootMargin = "0px 0px -10% 0px", threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
}

// Writes how far an element has travelled through the viewport to the CSS variable `--p` (0 → 1),
// straight to the DOM so scrolling never re-renders React. `start`/`end` are viewport fractions:
// --p is 0 when the element's top reaches `start` and 1 when its bottom reaches `end`.
// Listens only while the element is near the screen; reduced-motion users get --p: 1 right away.
export function useScrollProgress({ start = 1, end = 0 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const rect = node.getBoundingClientRect();
      const p = (start * vh - rect.top) / (start * vh - end * vh + rect.height);
      node.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
        update();
      },
      { rootMargin: "20% 0px" }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [start, end]);

  return ref;
}

export default function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Splits plain text into words that rise in sequence. `accent` words are set in italic.
// `immediate` plays on first paint (for above-the-fold headings) instead of on scroll.
export function WordReveal({ as: Tag = "h2", text, accent = [], className = "", immediate = false }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const words = text.split(" ");
  const state = immediate ? "is-immediate" : inView ? "is-visible" : "";

  return (
    <Tag ref={ref} className={`word-reveal ${state} ${className}`}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span className="w">
              <span style={{ "--i": i }}>{accent.includes(word) ? <em>{word}</em> : word}</span>
            </span>
            {i < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}
