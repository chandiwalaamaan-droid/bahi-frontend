import React, { useEffect, useRef, useState } from "react";
import { IconTheme } from "../Icons";

// Fades a section up into place the first time it scrolls into view, the
// same treatment used on plenty of marketing sites. Respects
// prefers-reduced-motion and falls back to always-visible if
// IntersectionObserver isn't available, so nothing ever gets stuck hidden.
export function Reveal({ as: Tag = "section", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal${inView ? " in-view" : ""}${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function LandingNav({ active, darkMode, onToggleDark, onHome, onFeatures, onSignIn, onGetStarted }) {
  return (
    <header className="landing-nav">
      <div className="landing-nav-wrap">
        <button className="landing-logo" onClick={onHome} aria-label="Bahi home">
          <img src="/logo.png" alt="" width={28} height={28} />
          Bahi
        </button>
        <div className="landing-nav-links">
          <button className={active === "home" ? "active" : ""} onClick={onHome}>Home</button>
          <button className={active === "features" ? "active" : ""} onClick={onFeatures}>Features</button>
        </div>
        <div className="landing-nav-cta">
          <button className="landing-theme-toggle" onClick={onToggleDark} aria-label="Toggle dark mode">
            <IconTheme dark={darkMode} />
          </button>
          <button className="link-btn" onClick={onSignIn}>Sign in</button>
          <button className="btn sm" onClick={onGetStarted}>Get started free</button>
        </div>
      </div>
    </header>
  );
}

export function LandingFooter({ onFeatures }) {
  return (
    <footer className="landing-footer">
      <div className="landing-wrap">
        <span className="landing-logo">
          <img src="/logo.png" alt="" width={24} height={24} />
          Bahi
        </span>
        <div className="landing-foot-links">
          <button onClick={onFeatures}>Features</button>
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
        </div>
        <span className="landing-foot-note">Free bookkeeping &amp; AI-assisted tax tools, built for India.</span>
      </div>
    </footer>
  );
}
