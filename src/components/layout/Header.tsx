"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  ["主题", "/topics"],
  ["理论知识", "/theories"],
  ["学者", "/scholars"],
  ["经典作品", "/works"],
  ["概念", "/concepts"],
] as const;

function MenuIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="Syrtag 首页">Syrtag</Link>
        <nav className="site-header__nav" aria-label="Primary navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="site-header__actions">
          <Link href="/search" className="header-action">搜索图谱</Link>
          <button type="button" className="icon-control site-header__menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {menuOpen && <nav className="site-header__mobile-nav" aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
    </header>
  );
}
