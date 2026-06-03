"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InstaPost {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  media_type: string;
}

const INSTAGRAM_HANDLE = "emiliabhairstylist";

export default function Portfolio() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "fallback">(
    "loading"
  );

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (data.posts?.length) {
          setPosts(data.posts.slice(0, 9));
          setStatus("ok");
        } else {
          setStatus("fallback");
        }
      })
      .catch(() => setStatus("fallback"));
  }, []);

  return (
    <section
      id="portfolio"
      className="py-24 px-6 lg:px-12"
      style={{ borderTop: `1px solid var(--color-border)` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: "var(--color-gold)" }}
          >
            Selected Work
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-center"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-cream)",
            }}
          >
            The Portfolio
          </h2>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse"
                style={{ background: "var(--color-surface)" }}
              />
            ))}
          </div>
        )}

        {status === "ok" && (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {posts.map((post) => {
              const src =
                post.media_type === "VIDEO"
                  ? post.thumbnail_url ?? post.media_url
                  : post.media_url;
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden group"
                >
                  <Image
                    src={src}
                    alt={post.caption?.slice(0, 60) ?? "EmiliaB work"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 33vw, 25vw"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: "rgba(12,12,12,0.5)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: "var(--color-gold)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {status === "fallback" && (
          <div
            className="flex flex-col items-center justify-center py-20 border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-12 h-12 mb-6"
              fill="currentColor"
              style={{ color: "var(--color-gold)" }}
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <p
              className="text-lg mb-2"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-cream)",
              }}
            >
              Follow my work on Instagram
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-muted)" }}
            >
              The full portfolio lives there, updated after every event.
            </p>
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-xs tracking-[0.3em] uppercase border transition-all duration-300"
              style={{
                borderColor: "var(--color-gold)",
                color: "var(--color-gold)",
              }}
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
        )}

        {status === "ok" && (
          <div className="flex justify-center mt-10">
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.3em] uppercase transition-colors duration-300"
              style={{ color: "var(--color-muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--color-gold)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--color-muted)")
              }
            >
              View all on Instagram →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
