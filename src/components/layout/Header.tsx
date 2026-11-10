"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ENTITY_INDEXES } from "@/lib/entity-routes";

function MenuIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const browseId = useId();
  const browseRef = useRef<HTMLDetailsElement>(null);

  function closeBrowse() {
    if (browseRef.current) browseRef.current.open = false;
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      closeBrowse();
    }
    function onPointerDown(event: PointerEvent) {
      if (browseRef.current?.open && !browseRef.current.contains(event.target as Node)) {
        closeBrowse();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="Syrtag home">Syrtag</Link>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <details
            className="site-header__browse"
            ref={browseRef}
          >
            <summary className="site-header__browse-toggle">Browse</summary>
            <ul id={browseId} className="site-header__browse-menu">
              {ENTITY_INDEXES.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} onClick={closeBrowse}>{label}</Link>
                </li>
              ))}
            </ul>
          </details>
          <Link href="/about">About</Link>
        </nav>
        <div className="site-header__actions">
          <Link href="/search" className="site-header__search-link" aria-label="Search Syrtag">Search</Link>
          <button type="button" className="icon-control site-header__menu-button" aria-controls="mobile-primary-navigation" aria-label={menuOpen ? "Close primary navigation" : "Open primary navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-primary-navigation" className="site-header__mobile-nav" aria-label="Mobile primary navigation">
          <Link href="/search" onClick={() => setMenuOpen(false)}>Search</Link>
          {ENTITY_INDEXES.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </nav>
      )}
    </header>
  );
}
