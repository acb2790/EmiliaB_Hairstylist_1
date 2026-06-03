const events = [
  {
    title: "Weddings",
    description:
      "Bridal hair that withstands long ceremonies, outdoor settings, and every dance floor — from intimate elopements to grand European venues.",
    icon: "◇",
  },
  {
    title: "Sports Events",
    description:
      "Fast, precise hair prep for athletes, award ceremonies, and podium moments where appearance matters as much as performance.",
    icon: "◈",
  },
  {
    title: "Corporate & Galas",
    description:
      "Executive headshots, press events, product launches, and black-tie galas — polished looks on a professional timeline.",
    icon: "◉",
  },
  {
    title: "Other Occasions",
    description:
      "Editorials, film sets, family portraits, quinceañeras, and any milestone worth looking extraordinary for.",
    icon: "◎",
  },
];

const included = [
  "12 hours on-site availability",
  "Professional tools and styling products",
  "Consultation before the event",
  "Touch-ups throughout the day",
];

const notIncluded = [
  "Travel expenses (flights, fuel, transfers)",
  "Hotel and accommodation",
  "Meals during the event",
  "Hair extensions or merchandise",
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 px-6 lg:px-12"
      style={{ borderTop: `1px solid var(--color-border)`, background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: "var(--color-gold)" }}
          >
            What I Do
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-center"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-cream)",
            }}
          >
            Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {events.map((e) => (
            <div
              key={e.title}
              className="p-8 flex flex-col gap-4 border transition-all duration-300 hover:border-[var(--color-gold)] group"
              style={{
                background: "var(--color-near-black)",
                borderColor: "var(--color-border)",
              }}
            >
              <span
                className="text-2xl transition-colors duration-300"
                style={{ color: "var(--color-muted)" }}
              >
                {e.icon}
              </span>
              <h3
                className="text-lg font-light"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--color-cream)",
                }}
              >
                {e.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                {e.description}
              </p>
            </div>
          ))}
        </div>

        <div className="border" style={{ borderColor: "var(--color-border)" }}>
          <div
            className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="p-10 lg:p-12 flex flex-col items-center justify-center text-center">
              <p
                className="text-xs tracking-[0.4em] uppercase mb-4"
                style={{ color: "var(--color-gold)" }}
              >
                Day Rate
              </p>
              <p
                className="text-6xl lg:text-7xl font-light mb-2"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--color-cream)",
                }}
              >
                999<span className="text-4xl">€</span>
              </p>
              <p
                className="text-xs tracking-[0.25em] uppercase mb-6"
                style={{ color: "var(--color-muted)" }}
              >
                Per Day · 12h Availability
              </p>
              <a
                href="#quote"
                className="text-xs tracking-[0.3em] uppercase px-6 py-3 transition-all duration-300"
                style={{
                  background: "var(--color-gold)",
                  color: "var(--color-near-black)",
                }}
              >
                Request a Quote
              </a>
            </div>

            <div
              className="p-10 lg:p-12"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: "var(--color-gold)" }}
              >
                Included
              </p>
              <ul className="flex flex-col gap-4">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span style={{ color: "var(--color-gold)" }}>—</span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-cream)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="p-10 lg:p-12"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: "var(--color-muted)" }}
              >
                Not Included
              </p>
              <ul className="flex flex-col gap-4">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span style={{ color: "var(--color-muted)" }}>×</span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
