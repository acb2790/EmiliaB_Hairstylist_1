"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t py-12 px-6 lg:px-12"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span
            className="text-xl tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-cream)",
            }}
          >
            Emilia B.
          </span>
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--color-muted)" }}
          >
            Hairstylist
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <a
            href="https://instagram.com/emiliabhairstylist"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase transition-colors duration-300"
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
            @emiliabhairstylist
          </a>
          <p
            className="text-xs"
            style={{ color: "var(--color-muted)" }}
          >
            Travel · Europe-wide
          </p>
        </div>

        <p
          className="text-xs"
          style={{ color: "var(--color-muted)" }}
        >
          © {year} Emilia B. Hairstylist. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
