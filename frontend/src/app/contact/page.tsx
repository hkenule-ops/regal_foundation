"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      await api.submitContact(form);
      setResult({
        ok: true,
        text: "Message sent. The Foundation team will respond shortly.",
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof Error ? err.message : "Failed to send. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-gold">
            Contact
          </p>
          <h1 className="section-heading">Get in Touch</h1>
          <p className="mt-3 text-regal-earth">
            Partnership inquiries, media, or general questions — we&apos;d love to hear from you.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-regal-navy">Offices</h3>
              <p className="text-regal-earth">Port Harcourt & Abuja, Nigeria</p>
            </div>
            <div>
              <h3 className="font-semibold text-regal-navy">Email</h3>
              <a href="mailto:info@regalfoundation.org" className="text-regal-gold hover:underline">
                info@regalfoundation.org
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Subject</label>
            <input className="input" required value={form.subject} onChange={(e) => update("subject", e.target.value)} />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" required rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Sending…" : "Send Message"}
          </button>
          {result && (
            <div className={`rounded-lg p-3 text-sm ${result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {result.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
