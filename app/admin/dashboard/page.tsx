"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { format, parseISO, startOfDay, isWithinInterval } from "date-fns";
import "react-day-picker/style.css";

interface Block {
  id: string;
  startDate: string;
  endDate: string;
  label?: string;
}

interface Quote {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate: string;
  location: string;
  guests?: number;
  message?: string;
  status: string;
  createdAt: string;
}

type Tab = "availability" | "quotes";

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("availability");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadBlocks = () =>
    fetch("/api/admin/availability")
      .then((r) => r.json())
      .then((d) => setBlocks(d.blocks ?? []));

  const loadQuotes = () =>
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes ?? []));

  useEffect(() => {
    loadBlocks();
    loadQuotes();
  }, []);

  const isBooked = (date: Date) =>
    blocks.some((b) =>
      isWithinInterval(startOfDay(date), {
        start: startOfDay(parseISO(b.startDate)),
        end: startOfDay(parseISO(b.endDate)),
      })
    );

  const handleBlock = async () => {
    if (!range.from) return;
    setSaving(true);
    setMsg("");
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to ?? range.from, "yyyy-MM-dd"),
        label,
      }),
    });
    setRange({});
    setLabel("");
    await loadBlocks();
    setMsg("Date blocked successfully.");
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/availability?id=${id}`, { method: "DELETE" });
    await loadBlocks();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const tabClass = (t: Tab) =>
    `px-6 py-3 text-xs tracking-[0.25em] uppercase transition-colors duration-200 ${
      tab === t
        ? "border-b-2"
        : "opacity-50 hover:opacity-100"
    }`;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-near-black)", color: "var(--color-cream)" }}
    >
      <header
        className="flex items-center justify-between px-6 lg:px-12 h-16 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <span
          className="text-lg tracking-widest uppercase"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          EmiliaB · Admin
        </span>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-xs tracking-wide uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="text-xs tracking-wide uppercase px-4 py-2 border transition-colors"
            style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div
        className="flex border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={() => setTab("availability")}
          className={tabClass("availability")}
          style={
            tab === "availability"
              ? { borderColor: "var(--color-gold)", color: "var(--color-gold)" }
              : { color: "var(--color-muted)" }
          }
        >
          Availability
        </button>
        <button
          onClick={() => setTab("quotes")}
          className={tabClass("quotes")}
          style={
            tab === "quotes"
              ? { borderColor: "var(--color-gold)", color: "var(--color-gold)" }
              : { color: "var(--color-muted)" }
          }
        >
          Quote Requests{" "}
          {quotes.filter((q) => q.status === "new").length > 0 && (
            <span
              className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-near-black)",
              }}
            >
              {quotes.filter((q) => q.status === "new").length}
            </span>
          )}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10">
        {tab === "availability" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2
                className="text-xl font-light mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Block Dates
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
                Select a date or range to mark as booked. These will appear red
                on the public calendar.
              </p>

              <div
                className="p-6 border mb-6"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <style>{`
                  .rdp-root { --rdp-accent-color: var(--color-gold); color: var(--color-cream); }
                  .rdp-month_caption { font-family: var(--font-playfair); color: var(--color-cream); }
                  .rdp-weekdays { color: var(--color-muted); }
                  .rdp-day { color: var(--color-cream); }
                  .day-booked .rdp-day_button { background: rgba(180,50,50,0.35) !important; text-decoration: line-through; }
                  .rdp-range_start .rdp-day_button, .rdp-range_end .rdp-day_button { background: var(--color-gold) !important; color: var(--color-near-black) !important; }
                  .rdp-range_middle .rdp-day_button { background: rgba(201,169,110,0.2) !important; }
                  .rdp-nav button { color: var(--color-cream); }
                `}</style>
                <DayPicker
                  mode="range"
                  selected={{ from: range.from, to: range.to }}
                  onSelect={(r) => setRange(r ?? {})}
                  modifiers={{ booked: isBooked }}
                  modifiersClassNames={{ booked: "day-booked" }}
                  disabled={{ before: new Date() }}
                />
              </div>

              <div className="flex flex-col gap-4">
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Label (optional, e.g. Wedding – Milan)"
                  className="w-full bg-transparent border-b py-2 text-sm outline-none"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-cream)",
                  }}
                />

                {range.from && (
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    Blocking:{" "}
                    <span style={{ color: "var(--color-gold)" }}>
                      {format(range.from, "d MMM yyyy")}
                      {range.to && range.to !== range.from
                        ? ` → ${format(range.to, "d MMM yyyy")}`
                        : ""}
                    </span>
                  </p>
                )}

                <button
                  onClick={handleBlock}
                  disabled={!range.from || saving}
                  className="self-start px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all disabled:opacity-50"
                  style={{
                    background: "var(--color-gold)",
                    color: "var(--color-near-black)",
                  }}
                >
                  {saving ? "Saving..." : "Block Dates"}
                </button>

                {msg && (
                  <p className="text-xs" style={{ color: "var(--color-gold)" }}>
                    {msg}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2
                className="text-xl font-light mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Blocked Periods
              </h2>

              {blocks.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  No dates blocked yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {blocks
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime()
                    )
                    .map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-4 border"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <div>
                          <p className="text-sm" style={{ color: "var(--color-cream)" }}>
                            {format(parseISO(b.startDate), "d MMM yyyy")}
                            {b.endDate !== b.startDate
                              ? ` → ${format(parseISO(b.endDate), "d MMM yyyy")}`
                              : ""}
                          </p>
                          {b.label && (
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "var(--color-muted)" }}
                            >
                              {b.label}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-xs px-3 py-1 border transition-colors"
                          style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-muted)",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "quotes" && (
          <div>
            <h2
              className="text-xl font-light mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Quote Requests
            </h2>

            {quotes.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                No quote requests yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {quotes
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((q) => (
                    <div
                      key={q.id}
                      className="border p-6"
                      style={{
                        background: "var(--color-surface)",
                        borderColor:
                          q.status === "new"
                            ? "var(--color-gold)"
                            : "var(--color-border)",
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <p
                            className="text-lg font-light"
                            style={{ fontFamily: "var(--font-playfair)", color: "var(--color-cream)" }}
                          >
                            {q.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                            {format(new Date(q.createdAt), "d MMM yyyy, HH:mm")}
                          </p>
                        </div>
                        {q.status === "new" && (
                          <span
                            className="text-xs px-2 py-1 tracking-wide uppercase"
                            style={{
                              background: "var(--color-gold)",
                              color: "var(--color-near-black)",
                            }}
                          >
                            New
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span style={{ color: "var(--color-muted)" }}>Email: </span>
                          <a
                            href={`mailto:${q.email}`}
                            style={{ color: "var(--color-cream)" }}
                          >
                            {q.email}
                          </a>
                        </div>
                        {q.phone && (
                          <div>
                            <span style={{ color: "var(--color-muted)" }}>Phone: </span>
                            <span style={{ color: "var(--color-cream)" }}>{q.phone}</span>
                          </div>
                        )}
                        <div>
                          <span style={{ color: "var(--color-muted)" }}>Event: </span>
                          <span style={{ color: "var(--color-cream)" }}>{q.eventType}</span>
                        </div>
                        <div>
                          <span style={{ color: "var(--color-muted)" }}>Date: </span>
                          <span style={{ color: "var(--color-cream)" }}>
                            {format(parseISO(q.eventDate), "d MMM yyyy")}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--color-muted)" }}>Location: </span>
                          <span style={{ color: "var(--color-cream)" }}>{q.location}</span>
                        </div>
                        {q.guests && (
                          <div>
                            <span style={{ color: "var(--color-muted)" }}>Guests: </span>
                            <span style={{ color: "var(--color-cream)" }}>{q.guests}</span>
                          </div>
                        )}
                      </div>

                      {q.message && (
                        <p
                          className="mt-4 text-sm leading-relaxed border-t pt-4"
                          style={{
                            color: "var(--color-muted)",
                            borderColor: "var(--color-border)",
                          }}
                        >
                          {q.message}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
