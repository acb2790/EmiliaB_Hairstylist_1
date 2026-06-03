"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { isWithinInterval, parseISO, startOfDay } from "date-fns";
import "react-day-picker/style.css";

interface Block {
  id: string;
  startDate: string;
  endDate: string;
  label?: string;
}

export default function AvailabilityCalendar() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        setBlocks(data.blocks ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isBooked = (date: Date) => {
    const d = startOfDay(date);
    return blocks.some((b) =>
      isWithinInterval(d, {
        start: startOfDay(parseISO(b.startDate)),
        end: startOfDay(parseISO(b.endDate)),
      })
    );
  };

  const today = startOfDay(new Date());

  return (
    <section
      id="availability"
      className="py-24 px-6 lg:px-12"
      style={{ borderTop: `1px solid var(--color-border)` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: "var(--color-gold)" }}
          >
            Book a Date
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-center"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-cream)",
            }}
          >
            Availability
          </h2>
          <p
            className="mt-4 text-sm text-center max-w-md"
            style={{ color: "var(--color-muted)" }}
          >
            Dates marked in red are already booked. All other dates are open —
            reach out to confirm.
          </p>
        </div>

        <div className="flex justify-center">
          {loading ? (
            <div
              className="w-72 h-72 animate-pulse rounded"
              style={{ background: "var(--color-surface)" }}
            />
          ) : (
            <div
              className="p-6 border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <style>{`
                .rdp-root {
                  --rdp-accent-color: var(--color-gold);
                  --rdp-accent-background-color: rgba(201,169,110,0.15);
                  --rdp-day-font: var(--font-inter), system-ui, sans-serif;
                  color: var(--color-cream);
                }
                .rdp-day {
                  color: var(--color-cream);
                }
                .rdp-day_button {
                  cursor: default !important;
                  pointer-events: none;
                }
                .rdp-selected .rdp-day_button {
                  background: var(--color-gold) !important;
                  color: var(--color-near-black) !important;
                }
                .rdp-outside {
                  opacity: 0.25;
                }
                .rdp-disabled {
                  opacity: 0.4;
                }
                .rdp-nav button {
                  color: var(--color-cream);
                }
                .rdp-month_caption {
                  color: var(--color-cream);
                  font-family: var(--font-playfair);
                }
                .rdp-weekdays {
                  color: var(--color-muted);
                }
                .day-booked .rdp-day_button,
                button.rdp-day_button.day-booked {
                  background:
                    linear-gradient(45deg, transparent 38%, rgba(210,50,50,0.9) 38%, rgba(210,50,50,0.9) 62%, transparent 62%),
                    linear-gradient(-45deg, transparent 38%, rgba(210,50,50,0.9) 38%, rgba(210,50,50,0.9) 62%, transparent 62%),
                    rgba(180,50,50,0.12) !important;
                  color: rgba(245,240,232,0.25) !important;
                }
              `}</style>
              <DayPicker
                numberOfMonths={2}
                disabled={[{ before: today }, isBooked]}
                modifiers={{ booked: isBooked }}
                modifiersClassNames={{ booked: "day-booked" }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8 mt-8">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: "var(--color-gold)" }}
            />
            <span
              className="text-xs tracking-wide uppercase"
              style={{ color: "var(--color-muted)" }}
            >
              Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: "rgba(180,50,50,0.5)" }}
            />
            <span
              className="text-xs tracking-wide uppercase"
              style={{ color: "var(--color-muted)" }}
            >
              Booked
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
