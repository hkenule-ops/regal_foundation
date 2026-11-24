"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const roles = [
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "lab_tech", label: "Lab Tech" },
  { value: "education_mentor", label: "Education & Youth Mentor" },
  { value: "food_logistics", label: "Food & Welfare Logistics" },
  { value: "media", label: "Media / Documentation" },
  { value: "general", label: "General Volunteer" },
];

const locations = [
  { value: "port_harcourt", label: "Port Harcourt" },
  { value: "abuja", label: "Abuja" },
  { value: "willing_to_travel", label: "Willing to travel" },
];

export default function VolunteerPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "general",
    base_location: "port_harcourt",
    license_number: "",
    specialty: "",
    availability_notes: "",
    experience_years: "",
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
      await api.registerVolunteer({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        base_location: form.base_location,
        license_number: form.license_number || undefined,
        specialty: form.specialty || undefined,
        availability_notes: form.availability_notes || undefined,
        experience_years: form.experience_years ? Number(form.experience_years) : undefined,
      });
      setResult({
        ok: true,
        text: "Thank you! Your volunteer registration has been received. Our team will be in touch.",
      });
      setForm({
        full_name: "",
        email: "",
        phone: "",
        role: "general",
        base_location: "port_harcourt",
        license_number: "",
        specialty: "",
        availability_notes: "",
        experience_years: "",
      });
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof Error ? err.message : "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-gold">Volunteer</p>
      <h1 className="section-heading">Join a Field Mission</h1>
      <p className="mt-2 text-sm text-regal-earth">
        Medical personnel, teachers, logistics, and media volunteers welcome.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input className="input" required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" required value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <label className="label">Role</label>
          <select className="input" value={form.role} onChange={(e) => update("role", e.target.value)}>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Base location</label>
          <select className="input" value={form.base_location} onChange={(e) => update("base_location", e.target.value)}>
            {locations.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">License number (clinical roles)</label>
          <input className="input" value={form.license_number} onChange={(e) => update("license_number", e.target.value)} />
        </div>
        <div>
          <label className="label">Specialty</label>
          <input className="input" value={form.specialty} onChange={(e) => update("specialty", e.target.value)} />
        </div>
        <div>
          <label className="label">Years of experience</label>
          <input type="number" min={0} className="input" value={form.experience_years} onChange={(e) => update("experience_years", e.target.value)} />
        </div>
        <div>
          <label className="label">Availability notes</label>
          <textarea className="input" rows={3} value={form.availability_notes} onChange={(e) => update("availability_notes", e.target.value)} />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Submitting…" : "Register as Volunteer"}
        </button>

        {result && (
          <div className={`rounded-lg p-4 text-sm ${result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {result.text}
          </div>
        )}
      </form>
    </div>
  );
}
