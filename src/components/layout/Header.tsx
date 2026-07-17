"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  ["Topics", "/topics"],
  ["Theories", "/theories"],
  ["Scholars", "/scholars"],
  ["Works", "/works"],
  ["Concepts", "/concepts"],
  ["Pricing", "/pricing"],
] as const;

function MenuIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="Syrtag home">Syrtag</Link>
        <nav className="site-header__nav" aria-label="Primary navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="site-header__actions">
          <Link href="/search" className="header-action">Search Syrtag</Link>
          <button type="button" className="icon-control site-header__menu-button" aria-controls="mobile-primary-navigation" aria-label={menuOpen ? "Close primary navigation" : "Open primary navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-primary-navigation" className="site-header__mobile-nav" aria-label="Mobile primary navigation">{navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
    </header>
  );
}
