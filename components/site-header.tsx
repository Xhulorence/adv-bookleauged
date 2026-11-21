"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDemoStore } from "@/lib/demo-store";

export default function SiteHeader() {
  return <Suspense fallback={<div className="site-header" aria-hidden="true" />}><SiteHeaderContent /></Suspense>;
}

function SiteHeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useDemoStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (!logoutConfirmOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setLogoutConfirmOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [logoutConfirmOpen]);

  if (pathname === "/login" || pathname === "/signup") return null;

  function signOut() {
    logout();
    setMenuOpen(false);
    setLogoutConfirmOpen(false);
    router.push("/login");
  }

  function requestSignOut() {
    setMenuOpen(false);
    setLogoutConfirmOpen(true);
  }

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="BookLeagued home">
        <Image
          alt="BookLeagued"
          className="brand-logo"
          height={321}
          priority
          src="/images/bookleagued-logo.png"
          width={689}
        />
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <Link className={pathname === "/" ? "active" : ""} href="/">Home</Link>
        <Link className={pathname.startsWith("/books") ? "active" : ""} href="/books">Books</Link>
        <Link className={pathname.startsWith("/groups") ? "active" : ""} href="/groups">Groups</Link>
      </nav>

      <div className="header-actions">
        {currentUser ? (
          <div className="profile-menu-wrap">
            <Link className="profile-link" href="/profile" aria-label="Your profile">
              {currentUser.avatarImageUrl ? (
                <Image
                  alt={`${currentUser.name} profile`}
                  className="profile-avatar profile-avatar-image"
                  height={36}
                  src={currentUser.avatarImageUrl}
                  unoptimized
                  width={36}
                />
              ) : (
                <span className="profile-avatar">{currentUser.avatar.slice(0, 1)}</span>
              )}
              <span className="profile-name">{currentUser.name}</span>
            </Link>
            <button
              aria-label="Log out"
              className="header-logout"
              onClick={requestSignOut}
              type="button"
            >
              Log out
            </button>
            <button
              aria-expanded={menuOpen}
              aria-label="Toggle account menu"
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
            {menuOpen && (
              <div className="profile-dropdown">
                <Link href="/profile" onClick={() => setMenuOpen(false)}>My profile</Link>
                <Link href="/posts/new" onClick={() => setMenuOpen(false)}>Write a post</Link>
                <button onClick={requestSignOut} type="button">Log out</button>
              </div>
            )}
          </div>
        ) : (
          <Link className="header-write-link" href="/login">Log in</Link>
        )}
      </div>
      {logoutConfirmOpen && (
        <div
          aria-labelledby="logout-title"
          aria-modal="true"
          className="logout-overlay"
          role="dialog"
        >
          <button
            aria-label="Close logout confirmation"
            className="logout-backdrop"
            onClick={() => setLogoutConfirmOpen(false)}
            type="button"
          />
          <section className="logout-modal">
            <span className="logout-mark" aria-hidden="true">b.</span>
            <span className="eyebrow">Closing your reading nook</span>
            <h2 id="logout-title">Are you sure you want to log out?</h2>
            <p>You can return whenever you’re ready for another chapter.</p>
            <div className="logout-actions">
              <button
                className="button logout-cancel"
                onClick={() => setLogoutConfirmOpen(false)}
                type="button"
              >
                Stay here
              </button>
              <button className="button button-green logout-confirm" onClick={signOut} type="button">
                Log out <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}
