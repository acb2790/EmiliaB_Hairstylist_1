"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { format, parseISO, startOfDay, isWithinInterval } from "date-fns";
import "react-day-picker/style.css";

interface Block {
  id: string;
  startDate: string;
  endDate: string;
}

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please select a date"),
  eventDateEnd: z.string().optional(),
  location: z.string().min(2, "Please enter the event location"),
  guests: z.string().optional(),
  message: z.string().optional(),
  terms: z
    .boolean()
    .refine((v) => v === true, "You must accept the terms to proceed"),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent border-b py-3 text-sm outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)]";

const inputStyle = {
  borderColor: "var(--color-border)",
  color: "var(--color-cream)",
};

export default function QuoteForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [calOpen, setCalOpen] = useState(false);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [blocks, setBlocks] = useState<Block[]>([]);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => setBlocks(d.blocks ?? []))
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    }
    if (calOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calOpen]);

  function handleRangeSelect(r: { from?: Date; to?: Date } | undefined) {
    const next = r ?? {};
    setRange(next);
    setValue("eventDate", next.from ? format(next.from, "yyyy-MM-dd") : "");
    setValue(
      "eventDateEnd",
      next.to ? format(next.to, "yyyy-MM-dd") : undefined
    );
  }

  function formatRangeLabel() {
    if (!range.from) return "";
    if (!range.to || range.to.getTime() === range.from.getTime())
      return format(range.from, "d MMM yyyy");
    return `${format(range.from, "d MMM yyyy")} – ${format(range.to, "d MMM yyyy")}`;
  }

  const onSubmit = async (data: FormData) => {
    setState("sending");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setState("done");
        reset();
        setRange({});
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const today = startOfDay(new Date());

  const isBooked = (date: Date) => {
    const d = startOfDay(date);
    return blocks.some((b) =>
      isWithinInterval(d, {
        start: startOfDay(parseISO(b.startDate)),
        end: startOfDay(parseISO(b.endDate)),
      })
    );
  };

  // Disable a date if it is booked OR if selecting it as an end date would
  // create a range that crosses any booked block.
  const isDisabled = (date: Date): boolean => {
    const d = startOfDay(date);
    if (d < today) return true;
    if (isBooked(d)) return true;
    if (range.from && d > startOfDay(range.from)) {
      const from = startOfDay(range.from);
      return blocks.some((b) => {
        const bs = startOfDay(parseISO(b.startDate));
        const be = startOfDay(parseISO(b.endDate));
        return bs <= d && be >= from;
      });
    }
    return false;
  };

  return (
    <section
      id="quote"
      className="py-24 px-6 lg:px-12"
      style={{
        borderTop: `1px solid var(--color-border)`,
        background: "var(--color-surface)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: "var(--color-gold)" }}
          >
            Let&apos;s Work Together
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-center"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-cream)",
            }}
          >
            Request a Quotation
          </h2>
          <p
            className="mt-4 text-sm text-center max-w-md"
            style={{ color: "var(--color-muted)" }}
          >
            Fill in the details below and I&apos;ll get back to you within 24
            hours to discuss your event.
          </p>
        </div>

        {state === "done" ? (
          <div
            className="border p-12 text-center flex flex-col items-center gap-4"
            style={{ borderColor: "var(--color-gold)" }}
          >
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center text-xl"
              style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}
            >
              ✓
            </div>
            <p
              className="text-xl font-light"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-cream)",
              }}
            >
              Request Received
            </p>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              A confirmation has been sent to your email. I&apos;ll be in touch
              within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <input
                  {...register("name")}
                  placeholder="Full Name *"
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.name && (
                  <p className="text-xs mt-1" style={{ color: "#e05050" }}>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address *"
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.email && (
                  <p className="text-xs mt-1" style={{ color: "#e05050" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="Phone Number (optional)"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <select
                  {...register("eventType")}
                  className={inputClass}
                  style={{ ...inputStyle, background: "transparent" }}
                >
                  <option value="" style={{ background: "#141414" }}>
                    Event Type *
                  </option>
                  <option value="Wedding" style={{ background: "#141414" }}>
                    Wedding
                  </option>
                  <option value="Sports Event" style={{ background: "#141414" }}>
                    Sports Event
                  </option>
                  <option
                    value="Corporate / Gala"
                    style={{ background: "#141414" }}
                  >
                    Corporate / Gala
                  </option>
                  <option value="Other" style={{ background: "#141414" }}>
                    Other
                  </option>
                </select>
                {errors.eventType && (
                  <p className="text-xs mt-1" style={{ color: "#e05050" }}>
                    {errors.eventType.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("location")}
                  placeholder="City & Country *"
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.location && (
                  <p className="text-xs mt-1" style={{ color: "#e05050" }}>
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date range picker — spans full width */}
            <div ref={calRef} className="relative">
              <button
                type="button"
                onClick={() => setCalOpen((o) => !o)}
                className={`${inputClass} text-left`}
                style={{
                  ...inputStyle,
                  color: range.from ? "var(--color-cream)" : "var(--color-muted)",
                }}
              >
                {range.from ? formatRangeLabel() : "Event Date(s) *"}
              </button>
              {errors.eventDate && (
                <p className="text-xs mt-1" style={{ color: "#e05050" }}>
                  {errors.eventDate.message}
                </p>
              )}

              {calOpen && (
                <div
                  className="quote-calendar absolute z-50 mt-2 p-4 border"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    left: 0,
                  }}
                >
                  <DayPicker
                    mode="range"
                    selected={{ from: range.from, to: range.to }}
                    onSelect={handleRangeSelect}
                    disabled={isDisabled}
                    modifiers={{ booked: isBooked }}
                    modifiersClassNames={{ booked: "day-booked" }}
                    numberOfMonths={2}
                  />
                  <div className="flex justify-between items-center mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setRange({});
                        setValue("eventDate", "");
                        setValue("eventDateEnd", undefined);
                      }}
                      className="text-xs"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalOpen(false)}
                      className="text-xs px-4 py-1.5"
                      style={{
                        background: range.from ? "var(--color-gold)" : "var(--color-border)",
                        color: range.from ? "var(--color-near-black)" : "var(--color-muted)",
                        cursor: range.from ? "pointer" : "default",
                      }}
                    >
                      {range.from ? `Confirm — ${formatRangeLabel()}` : "Select a date"}
                    </button>
                  </div>
                </div>
              )}

              {/* hidden inputs registered with react-hook-form */}
              <input type="hidden" {...register("eventDate")} />
              <input type="hidden" {...register("eventDateEnd")} />
            </div>

            <div>
              <input
                {...register("guests")}
                type="number"
                min="1"
                placeholder="Number of people requiring hair services"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <textarea
                {...register("message")}
                placeholder="Additional details about your event..."
                rows={4}
                className={inputClass}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  {...register("terms")}
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 flex-shrink-0"
                  style={{ accentColor: "var(--color-gold)" }}
                />
                <span className="text-sm" style={{ color: "var(--color-muted)" }}>
                  I understand that the 999€/day rate does not include travel
                  expenses, accommodation, meals, or any merchandise. These are
                  to be arranged separately.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs mt-1" style={{ color: "#e05050" }}>
                  {errors.terms.message}
                </p>
              )}
            </div>

            {state === "error" && (
              <p className="text-sm" style={{ color: "#e05050" }}>
                Something went wrong. Please try again or reach out directly on
                Instagram.
              </p>
            )}

            <button
              type="submit"
              disabled={state === "sending"}
              className="self-start px-10 py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-60"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-near-black)",
              }}
            >
              {state === "sending" ? "Sending..." : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
