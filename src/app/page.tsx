"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { useApp } from "@/lib/app-store";

export default function Home() {
  const { user, profile } = useApp();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="card-surface mb-8 overflow-hidden rounded-[30px] p-5 sm:p-6">
        <div className="grid items-center gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brown sm:text-4xl">
              A home for every kind of art.
            </h1>
            <p className="mt-3 text-base text-brown/70">Share, explore, and save creative work.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {!user ? (
                <Link href="/login" className="btn-primary">Get started</Link>
              ) : !profile ? (
                <Link href="/profile" className="btn-primary">Set up profile</Link>
              ) : (
                <Link href="/create" className="btn-primary">Post artwork</Link>
              )}
              <Link href="/saved" className="btn-secondary">Saved works</Link>
            </div>
          </div>
          <div
            className="relative min-h-[280px] overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-2)] bg-cover bg-center sm:min-h-[340px]"
            style={{ backgroundImage: "url('/pic/pic1.jpg')" }}
            aria-label="Featured art collage"
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,47,40,0.06),rgba(58,47,40,0.18))]" />
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 sm:bottom-4 sm:left-4 sm:right-4 sm:gap-3">
              <div className="overflow-hidden rounded-xl border border-white/50 bg-white/20 shadow-sm backdrop-blur-[1px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pic/photography.jpg" alt="Photography" className="block aspect-[4/3] w-full object-cover" />
                <div className="bg-[rgba(255,250,244,0.82)] px-2 py-1 text-center text-xs font-medium text-brown">Photography</div>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/50 bg-white/20 shadow-sm backdrop-blur-[1px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pic/art.jpg" alt="Drawing art" className="block aspect-[4/3] w-full object-cover" />
                <div className="bg-[rgba(255,250,244,0.82)] px-2 py-1 text-center text-xs font-medium text-brown">Drawing</div>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/50 bg-white/20 shadow-sm backdrop-blur-[1px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pic/craft.jpg" alt="Craft" className="block aspect-[4/3] w-full object-cover" />
                <div className="bg-[rgba(255,250,244,0.82)] px-2 py-1 text-center text-xs font-medium text-brown">Craft</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-brown">Explore creative worlds</h2>
          <p className="mt-1 text-sm text-brown/65">Choose a category to discover artwork and artists.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="card-surface group overflow-hidden rounded-[24px] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(90,70,54,0.14)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(58,47,40,0.08))]" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-brown group-hover:text-rust">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-brown/70">{category.description}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(201,124,93,0.12)] px-3 py-1 text-xs font-semibold text-rust">
                    Open
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
