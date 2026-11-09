"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/app-store";

export function Nav() {
  const { user, profile, logout } = useApp();
  const pathname = usePathname();

  const item = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
        pathname === href ? "bg-[rgba(201,124,93,0.14)] text-rust" : "text-brown/80 hover:bg-white/50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(247,241,232,0.78)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pic/art-heaven-logo.png"
            alt="Art Heaven"
            className="block h-11 w-11 rounded-2xl object-cover shadow-sm"
          />
          <div className="font-semibold tracking-tight text-brown">Art Heaven</div>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {item("/", "Feed")}
          {user && item("/profile", profile ? "My profile" : "Set up profile")}
          {!user ? (
            item("/login", "Login")
          ) : (
            <button onClick={() => logout()} className="btn-secondary ml-1 !px-3 !py-2 text-sm">
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
