import { useState, useEffect, useRef } from "react";

const gold = "#C9A84C";
const goldLight = "#E2C97E";
const goldDark = "#8B6914";
const black = "#0A0A0A";
const darkNav = "#0D0D0D";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --gold: #C9A84C;
    --gold-light: #E2C97E;
    --gold-dark: #8B6914;
    --black: #0A0A0A;
    --deep: #111111;
    --surface: #161616;
    --text: #E8E0D0;
    --text-muted: #8A8070;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--text);
    font-family: 'Montserrat', sans-serif;
    overflow-x: hidden;
  }

  .cormorant { font-family: 'Cormorant Garamond', serif; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 2px; }

  /* Gold line decoration */
  .gold-line {
    display: inline-block;
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  /* Reveal animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 5px rgba(201,168,76,0.3); }
    50% { box-shadow: 0 0 20px rgba(201,168,76,0.6), 0 0 40px rgba(201,168,76,0.2); }
  }

  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* Nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 60px;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.4s ease;
  }
  .nav.scrolled {
    background: rgba(10,10,10,0.95);
    backdrop-filter: blur(20px);
    padding: 14px 60px;
    border-bottom: 1px solid rgba(201,168,76,0.15);
  }
  .nav-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 4px;
    color: var(--gold);
    text-transform: uppercase;
  }
  .nav-sub {
    font-size: 8px;
    letter-spacing: 6px;
    color: var(--text-muted);
    display: block;
    text-align: center;
    margin-top: 2px;
  }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.3s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  .nav-links a:hover { color: var(--gold); }
  .nav-links a:hover::after { transform: scaleX(1); }

  /* Hero */
  .hero {
    height: 100vh; min-height: 700px;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg,
      rgba(10,10,10,0.85) 0%,
      rgba(10,10,10,0.6) 40%,
      rgba(10,10,10,0.75) 100%
    ),
    linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.8) 100%);
    z-index: 1;
  }
  .hero-img {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80');
    background-size: cover;
    background-position: center;
    transform: scale(1.08);
    animation: slowZoom 20s ease-out forwards;
  }
  @keyframes slowZoom {
    from { transform: scale(1.08); }
    to { transform: scale(1.0); }
  }
  .hero-content {
    position: relative; z-index: 2;
    text-align: center;
    padding: 0 20px;
    animation: fadeIn 1.5s ease forwards;
  }
  .hero-eyebrow {
    font-size: 10px;
    letter-spacing: 8px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 28px;
    display: flex; align-items: center; justify-content: center; gap: 16px;
  }
  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 8vw, 110px);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -1px;
    color: white;
    margin-bottom: 8px;
  }
  .hero-title em {
    font-style: italic;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .hero-sub {
    font-size: 11px;
    letter-spacing: 6px;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 60px;
    margin-top: 16px;
  }
  .btn-gold {
    display: inline-block;
    padding: 16px 48px;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    text-decoration: none;
  }
  .btn-gold::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--gold);
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
    z-index: -1;
  }
  .btn-gold:hover { color: var(--black); }
  .btn-gold:hover::before { transform: translateX(0); }

  .hero-scroll {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .scroll-line {
    width: 1px; height: 60px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  .scroll-text {
    font-size: 8px; letter-spacing: 4px; color: var(--text-muted); text-transform: uppercase;
  }

  /* Sections */
  .section { padding: 120px 60px; max-width: 1400px; margin: 0 auto; }
  .section-full { padding: 120px 0; }

  .section-label {
    font-size: 9px;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 16px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .section-title em { font-style: italic; color: var(--gold); }

  /* About */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: center;
  }
  .about-text p {
    font-size: 15px;
    line-height: 1.9;
    color: rgba(232,224,208,0.7);
    font-weight: 300;
    margin-bottom: 20px;
  }
  .about-image {
    position: relative;
    height: 600px;
  }
  .about-img-main {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80');
    background-size: cover;
    background-position: center;
  }
  .about-img-frame {
    position: absolute;
    bottom: -30px; right: -30px;
    width: 60%; height: 60%;
    border: 1px solid rgba(201,168,76,0.4);
    pointer-events: none;
  }
  .about-img-label {
    position: absolute;
    top: -20px; left: -20px;
    background: var(--surface);
    border: 1px solid rgba(201,168,76,0.3);
    padding: 20px 28px;
  }
  .about-img-label span {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    color: var(--gold);
    display: block;
    line-height: 1;
  }
  .about-img-label small {
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  /* Stats */
  .stats-bar {
    background: var(--surface);
    border-top: 1px solid rgba(201,168,76,0.15);
    border-bottom: 1px solid rgba(201,168,76,0.15);
  }
  .stats-inner {
    max-width: 1400px; margin: 0 auto;
    padding: 60px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .stat-item {
    text-align: center;
    padding: 20px;
    position: relative;
  }
  .stat-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: rgba(201,168,76,0.2);
  }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 56px;
    font-weight: 300;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label {
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  /* Services */
  .services-bg { background: var(--deep); }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(201,168,76,0.1);
    margin-top: 60px;
  }
  .service-card {
    background: var(--deep);
    padding: 50px 40px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: default;
  }
  .service-card::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  .service-card:hover { background: var(--surface); }
  .service-card:hover::before { transform: scaleX(1); }
  .service-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px;
    font-weight: 300;
    color: rgba(201,168,76,0.08);
    position: absolute;
    top: 10px; right: 20px;
    line-height: 1;
    transition: color 0.4s;
  }
  .service-card:hover .service-num { color: rgba(201,168,76,0.15); }
  .service-icon {
    width: 40px; height: 40px;
    margin-bottom: 24px;
    color: var(--gold);
  }
  .service-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    margin-bottom: 16px;
    color: white;
  }
  .service-desc {
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-muted);
    font-weight: 300;
  }

  /* Portfolio */
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto;
    gap: 8px;
    margin-top: 60px;
  }
  .portfolio-item {
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }
  .portfolio-item:nth-child(1) { grid-column: span 7; grid-row: span 2; height: 560px; }
  .portfolio-item:nth-child(2) { grid-column: span 5; height: 276px; }
  .portfolio-item:nth-child(3) { grid-column: span 5; height: 276px; }
  .portfolio-item:nth-child(4) { grid-column: span 4; height: 300px; }
  .portfolio-item:nth-child(5) { grid-column: span 4; height: 300px; }
  .portfolio-item:nth-child(6) { grid-column: span 4; height: 300px; }

  .portfolio-img {
    width: 100%; height: 100%;
    object-fit: cover;
    background-size: cover;
    background-position: center;
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .portfolio-item:hover .portfolio-img { transform: scale(1.08); }
  .portfolio-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex; align-items: flex-end;
    padding: 30px;
  }
  .portfolio-item:hover .portfolio-overlay { opacity: 1; }
  .portfolio-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: white;
    font-weight: 300;
  }
  .portfolio-sub { font-size: 10px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; }

  /* Contact */
  .contact-bg { background: var(--surface); }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 100px;
    align-items: start;
  }
  .contact-info h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--gold);
    letter-spacing: 2px;
    margin-bottom: 12px;
    margin-top: 40px;
  }
  .contact-info p {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.8;
    font-weight: 300;
  }
  .email-highlight {
    font-size: 14px;
    color: var(--gold-light);
    font-weight: 400;
    letter-spacing: 0.5px;
  }
  .mail-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 14px 32px;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s;
    background: transparent;
    cursor: pointer;
  }
  .mail-btn:hover { background: var(--gold); color: var(--black); }

  .contact-form { display: flex; flex-direction: column; gap: 0; }
  .form-group {
    position: relative;
    border-bottom: 1px solid rgba(201,168,76,0.2);
    margin-bottom: 0;
    transition: border-color 0.3s;
  }
  .form-group:focus-within { border-color: var(--gold); }
  .form-group label {
    display: block;
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--text-muted);
    text-transform: uppercase;
    padding: 20px 0 6px;
  }
  .form-group input, .form-group textarea, .form-group select {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 300;
    padding: 0 0 16px;
    resize: none;
  }
  .form-group textarea { min-height: 100px; }
  .form-submit {
    margin-top: 48px;
    padding: 18px 56px;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    align-self: flex-start;
  }
  .form-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--gold);
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
    z-index: -1;
  }
  .form-submit:hover { color: var(--black); }
  .form-submit:hover::before { transform: translateX(0); }
  .success-msg {
    margin-top: 16px;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--gold);
    text-transform: uppercase;
    display: none;
  }
  .success-msg.show { display: block; animation: fadeIn 0.5s ease; }

  /* Footer */
  .footer {
    background: var(--black);
    border-top: 1px solid rgba(201,168,76,0.15);
    padding: 60px;
    text-align: center;
  }
  .footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .footer-sub {
    font-size: 9px;
    letter-spacing: 6px;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 40px;
  }
  .footer-links {
    display: flex; justify-content: center; gap: 48px;
    list-style: none;
    margin-bottom: 40px;
  }
  .footer-links a {
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--text-muted);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s;
  }
  .footer-links a:hover { color: var(--gold); }
  .footer-copy {
    font-size: 10px;
    color: rgba(138,128,112,0.4);
    letter-spacing: 2px;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .nav { padding: 16px 24px; }
    .nav.scrolled { padding: 12px 24px; }
    .nav-links { display: none; }
    .section { padding: 80px 24px; }
    .about-grid { grid-template-columns: 1fr; gap: 60px; }
    .about-image { height: 400px; }
    .stats-inner { grid-template-columns: repeat(2, 1fr); gap: 40px; padding: 40px 24px; }
    .stat-item::after { display: none; }
    .services-grid { grid-template-columns: 1fr; }
    .portfolio-grid { grid-template-columns: 1fr 1fr; }
    .portfolio-item { grid-column: span 1 !important; grid-row: span 1 !important; height: 220px !important; }
    .contact-grid { grid-template-columns: 1fr; gap: 60px; }
    .footer { padding: 40px 24px; }
    .footer-links { flex-wrap: wrap; gap: 24px; }
  }
`;

const services = [
  {
    num: "01",
    name: "Interior Design",
    desc: "Bespoke interior environments crafted with precision — where every material, texture, and proportion tells a story of refined living.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="4" y="8" width="32" height="24" rx="1" />
        <path d="M4 16h32M12 16v16M28 16v16" />
        <path d="M16 24h8" />
      </svg>
    ),
  },
  {
    num: "02",
    name: "Home Construction",
    desc: "From foundation to finish, we build residences that embody your vision with uncompromising quality and structural excellence.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 36h32M8 36V20M32 36V20M20 4L4 20h32L20 4z" />
        <rect x="16" y="26" width="8" height="10" />
      </svg>
    ),
  },
  {
    num: "03",
    name: "Luxury Interiors",
    desc: "Opulent spaces designed for those who demand the finest — curated palettes, rare materials, and couture-level attention to detail.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20 4l2 6h6l-5 4 2 6-5-3-5 3 2-6-5-4h6z" />
        <path d="M8 28h24M12 32h16M16 36h8" />
      </svg>
    ),
  },
  {
    num: "04",
    name: "Office Interior",
    desc: "Contemporary workspaces that inspire productivity and reflect brand identity — professional, purposeful, and impeccably designed.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="4" y="6" width="32" height="28" rx="1" />
        <path d="M4 14h32M14 14v20M14 20h18M14 26h18" />
      </svg>
    ),
  },
  {
    num: "05",
    name: "Architectural Design",
    desc: "Visionary architecture that balances aesthetics and function — creating iconic structures that stand the test of time.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M8 36V12l12-8 12 8v24" />
        <path d="M4 36h32M16 36V24h8v12" />
        <path d="M12 20h4M24 20h4M12 14h4M24 14h4" />
      </svg>
    ),
  },
  {
    num: "06",
    name: "Smart Living",
    desc: "Intelligent home systems seamlessly integrated — automation, lighting, climate, and security woven invisibly into beautiful spaces.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="20" cy="20" r="12" />
        <circle cx="20" cy="20" r="5" />
        <path d="M20 4v4M20 32v4M4 20h4M32 20h4" />
        <path d="M8.7 8.7l2.8 2.8M28.5 28.5l2.8 2.8M8.7 31.3l2.8-2.8M28.5 11.5l2.8-2.8" />
      </svg>
    ),
  },
];

const portfolioItems = [
  { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80", label: "Gulshan Residence", sub: "Luxury Villa" },
  { url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80", label: "Banani Penthouse", sub: "Interior Design" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80", label: "Dhanmondi Suite", sub: "Smart Living" },
  { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", label: "Corporate HQ", sub: "Office Interior" },
  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80", label: "Sky Villa", sub: "Architectural Design" },
  { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", label: "Private Retreat", sub: "Luxury Interior" },
];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function VistaraLifestyle() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", requirements: "" });
  const [submitted, setSubmitted] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", phone: "", requirements: "" });
  };

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div>
          <div className="nav-logo-text">Vistara</div>
          <small className="nav-sub">Lifestyle</small>
        </div>
        <ul className="nav-links">
          {["About", "Services", "Portfolio", "Contact"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn-gold" style={{ fontSize: "9px", padding: "12px 28px" }}>
          Get a Quote
        </a>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-img" />
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="gold-line" />
            Luxury Interior Design & Construction
            <span className="gold-line" />
          </div>
          <h1 className="hero-title cormorant">
            Limitless<br />
            <em>Lifestyle,</em>
          </h1>
          <p className="hero-sub">Timeless Design</p>
          <a href="#contact" className="btn-gold">Request a Consultation</a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "var(--black)" }}>
        <div className="section">
          <div className="about-grid">
            <div>
              <p className="section-label reveal">
                <span className="gold-line" style={{ width: "30px" }} />
                About Us
              </p>
              <h2 className="section-title reveal">
                Crafting Spaces<br />
                That <em>Transcend</em><br />
                Ordinary
              </h2>
              <div className="reveal">
                <p style={{ fontSize: "15px", lineHeight: "1.9", color: "rgba(232,224,208,0.7)", fontWeight: "300", marginBottom: "20px" }}>
                  Vistara Lifestyle is a luxury interior design & construction company in Bangladesh, creating modern homes, elegant interiors, and timeless lifestyle spaces with smart living, minimalist designs, and premium craftsmanship.
                </p>
                <p style={{ fontSize: "15px", lineHeight: "1.9", color: "rgba(232,224,208,0.5)", fontWeight: "300" }}>
                  We believe a space is more than its dimensions — it's an expression of identity, a canvas for memory, and a foundation for the life you aspire to live.
                </p>
              </div>
              <div className="reveal" style={{ marginTop: "40px" }}>
                <a href="#contact" className="btn-gold">Explore Our Work</a>
              </div>
            </div>
            <div className="about-image reveal">
              <div className="about-img-main" />
              <div className="about-img-frame" />
              <div className="about-img-label">
                <span>10+</span>
                <small>Years of Excellence</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[
            { num: "250+", label: "Projects Completed" },
            { num: "98%", label: "Client Satisfaction" },
            { num: "10+", label: "Years Experience" },
            { num: "50+", label: "Design Awards" },
          ].map((s, i) => (
            <div className="stat-item reveal" key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="stat-num cormorant">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="services-bg">
        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <p className="section-label reveal">
                <span className="gold-line" style={{ width: "30px" }} />
                Our Services
              </p>
              <h2 className="section-title reveal">
                A Full Spectrum<br />
                of <em>Design</em> &<br />
                Construction
              </h2>
            </div>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card reveal" key={i} style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                <div className="service-num cormorant">{s.num}</div>
                <div className="service-icon">{s.icon}</div>
                <div className="service-name cormorant">{s.name}</div>
                <div className="service-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" style={{ background: "var(--black)" }}>
        <div className="section">
          <p className="section-label reveal">
            <span className="gold-line" style={{ width: "30px" }} />
            Portfolio
          </p>
          <h2 className="section-title reveal">
            A Glimpse of Our<br />
            <em>Finest</em> Work
          </h2>
          <div className="portfolio-grid reveal">
            {portfolioItems.map((item, i) => (
              <div className="portfolio-item" key={i}>
                <div
                  className="portfolio-img"
                  style={{ backgroundImage: `url(${item.url})` }}
                />
                <div className="portfolio-overlay">
                  <div>
                    <div className="portfolio-sub">{item.sub}</div>
                    <div className="portfolio-label cormorant">{item.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-bg">
        <div className="section">
          <p className="section-label reveal">
            <span className="gold-line" style={{ width: "30px" }} />
            Contact
          </p>
          <h2 className="section-title reveal">
            Begin Your<br />
            <em>Vision</em> With Us
          </h2>
          <div className="contact-grid" style={{ marginTop: "60px" }}>
            <div className="reveal">
              <p style={{ fontSize: "14px", lineHeight: "1.9", color: "rgba(232,224,208,0.6)", fontWeight: "300" }}>
                Every exceptional space begins with a conversation. Tell us about your vision, and our team will craft a bespoke proposal tailored to your aspirations.
              </p>
              <h3>Email</h3>
              <p className="email-highlight">vistaralifestyle247@gmail.com</p>
              <a
                href="mailto:vistaralifestyle247@gmail.com"
                className="mail-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Mail Us Directly
              </a>
              <h3>Location</h3>
              <p>Dhaka, Bangladesh</p>
              <h3>Hours</h3>
              <p>Sunday — Thursday: 9am – 6pm<br />Friday – Saturday: By Appointment</p>
            </div>
            <div className="reveal">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+880"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ borderBottom: "none", marginBottom: "0" }}>
                  <label>Project Requirements</label>
                  <textarea
                    placeholder="Describe your vision, space, and requirements..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    style={{ borderBottom: "1px solid rgba(201,168,76,0.2)", paddingBottom: "16px", marginBottom: "0" }}
                    required
                  />
                </div>
                <button type="submit" className="form-submit">
                  Send Enquiry
                </button>
                <div className={`success-msg${submitted ? " show" : ""}`}>
                  ✦ Thank you. We'll be in touch shortly.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Vistara</div>
        <div className="footer-sub">Lifestyle</div>
        <div style={{ fontSize: "11px", color: "rgba(138,128,112,0.6)", letterSpacing: "2px", marginBottom: "32px", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
          Limitless Lifestyle, Timeless Design
        </div>
        <ul className="footer-links">
          {["About", "Services", "Portfolio", "Contact"].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="footer-copy">
          © {new Date().getFullYear()} Vistara Lifestyle. All rights reserved. · Bangladesh
        </div>
      </footer>
    </>
  );
}
