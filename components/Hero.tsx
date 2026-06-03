"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(201,169,110,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "var(--color-border)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "var(--color-border)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-8"
          style={{ color: "var(--color-gold)" }}
        >
          Luxury Hair Artistry · All Across Europe
        </p>

        <h1
          className="text-6xl sm:text-7xl lg:text-9xl font-light leading-none mb-6"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--color-cream)",
            letterSpacing: "-0.02em",
          }}
        >
          Emilia B.
        </h1>

        <div
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16" style={{ background: "var(--color-gold)" }} />
          <p
            className="text-xs tracking-[0.35em] uppercase"
            style={{ color: "var(--color-muted)" }}
          >
            Hairstylist
          </p>
          <div className="h-px w-16" style={{ background: "var(--color-gold)" }} />
        </div>

        <p
          className="text-base sm:text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Weddings, sports events, corporate occasions — wherever your moment
          unfolds, precision and artistry travel with you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#portfolio"
            className="px-8 py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-near-black)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--color-gold-light)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--color-gold)";
            }}
          >
            View My Work
          </a>
          <a
            href="#quote"
            className="px-8 py-4 text-xs tracking-[0.3em] uppercase border transition-all duration-300"
            style={{
              borderColor: "var(--color-gold)",
              color: "var(--color-gold)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--color-gold)";
              el.style.color = "var(--color-near-black)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "var(--color-gold)";
            }}
          >
            Request a Quote
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--color-muted)" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-12"
          style={{ background: "var(--color-border)" }}
        />
      </div>
    </section>
  );
}
