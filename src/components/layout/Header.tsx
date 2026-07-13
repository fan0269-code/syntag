"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchBox } from "@/components/search/SearchBox";
import { ENTITY_INDEXES } from "@/lib/entity-routes";

const navigation = [
  ...ENTITY_INDEXES.filter(({ type }) => ["discipline", "theory", "scholar", "topic"].includes(type)).map(({ label, href }) => [label, href] as const),
  ["About", "/about"],
];

function MenuIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo">Syrtag</Link>
        <nav className="site-header__nav" aria-label="Primary navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="site-header__actions">
          <SearchBox compact />
          <button type="button" className="icon-control site-header__menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {menuOpen && <nav className="site-header__mobile-nav" aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
    </header>
  );
}
