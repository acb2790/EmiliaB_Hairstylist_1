"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-near-black)" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-12">
          <p
            className="text-2xl tracking-widest uppercase mb-1"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-cream)",
            }}
          >
            EmiliaB
          </p>
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-gold)" }}
          >
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b py-3 text-sm outline-none"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-cream)",
              }}
              autoComplete="current-password"
            />
            {error && (
              <p className="text-xs mt-2" style={{ color: "#e05050" }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-50"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-near-black)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
