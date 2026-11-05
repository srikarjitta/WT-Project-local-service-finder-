"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Plus,
  Trash2,
  Globe,
  Tag,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */
interface ServiceEntry {
  id: string;
  name: string;
  price: string;
  unit: string;
}

interface OnboardingData {
  // Step 1
  businessName: string;
  category: string;
  tagline: string;
  yearsInBusiness: string;
  // Step 2
  address: string;
  locality: string;
  city: string;
  pincode: string;
  serviceRadius: string;
  // Step 3
  phone: string;
  altPhone: string;
  website: string;
  openDays: string[];
  openTime: string;
  closeTime: string;
  // Step 4
  services: ServiceEntry[];
}

const INITIAL: OnboardingData = {
  businessName: "",
  category: "",
  tagline: "",
  yearsInBusiness: "",
  address: "",
  locality: "",
  city: "",
  pincode: "",
  serviceRadius: "10",
  phone: "",
  altPhone: "",
  website: "",
  openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  openTime: "09:00",
  closeTime: "19:00",
  services: [{ id: "s1", name: "", price: "", unit: "per visit" }],
};

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Painting",
  "Cleaning",
  "AC & Appliance Repair",
  "Security & CCTV",
  "Interior Design",
  "Pest Control",
  "Beauty & Wellness",
  "Tutoring & Education",
  "Healthcare",
  "Other",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRICE_UNITS = ["per visit", "per hour", "per sq ft", "per unit", "fixed price"];

/* ─────────────────────────── Helpers ───────────────────────── */
function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-400 focus:ring-red-400" : "border-slate-200"
        }`}
      />
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Select({
  label,
  id,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─────────────────────────── Progress bar ──────────────────── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>Step {step} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── Step components ───────────────── */

// Step 1 — Business Identity
function StepIdentity({
  data,
  set,
  errors,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: OnboardingData[keyof OnboardingData]) => void;
  errors: Partial<Record<keyof OnboardingData, string>>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Building2 className="text-indigo-600" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Business Identity</h2>
          <p className="text-sm text-slate-500">Tell customers who you are</p>
        </div>
      </div>

      <Field
        label="Business Name"
        id="ob-name"
        placeholder="e.g. Apex Home Care & Electrical Solutions"
        value={data.businessName}
        onChange={(v) => set("businessName", v)}
        error={errors.businessName}
        required
      />

      <Select
        label="Business Category"
        id="ob-category"
        value={data.category}
        onChange={(v) => set("category", v)}
        options={CATEGORIES}
        required
      />

      <Field
        label="Tagline / One-liner"
        id="ob-tagline"
        placeholder="e.g. Fast, reliable home services at your doorstep"
        value={data.tagline}
        onChange={(v) => set("tagline", v)}
        hint="Appears below your business name on listings"
      />

      <Field
        label="Years in Business"
        id="ob-years"
        type="number"
        placeholder="e.g. 5"
        value={data.yearsInBusiness}
        onChange={(v) => set("yearsInBusiness", v)}
        hint="Builds trust with potential customers"
      />
    </div>
  );
}

// Step 2 — Location
function StepLocation({
  data,
  set,
  errors,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: OnboardingData[keyof OnboardingData]) => void;
  errors: Partial<Record<keyof OnboardingData, string>>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
          <MapPin className="text-emerald-600" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Location & Coverage</h2>
          <p className="text-sm text-slate-500">Where are you based and where do you serve?</p>
        </div>
      </div>

      <Field
        label="Street Address"
        id="ob-addr"
        placeholder="e.g. 24, 2nd Cross, Indiranagar"
        value={data.address}
        onChange={(v) => set("address", v)}
        error={errors.address}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Locality / Area"
          id="ob-locality"
          placeholder="e.g. Indiranagar"
          value={data.locality}
          onChange={(v) => set("locality", v)}
          error={errors.locality}
          required
        />
        <Field
          label="City"
          id="ob-city"
          placeholder="e.g. Bengaluru"
          value={data.city}
          onChange={(v) => set("city", v)}
          error={errors.city}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Pincode"
          id="ob-pincode"
          placeholder="e.g. 560038"
          value={data.pincode}
          onChange={(v) => set("pincode", v)}
          error={errors.pincode}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Service Radius (km)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={50}
              value={data.serviceRadius}
              onChange={(e) => set("serviceRadius", e.target.value)}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-sm font-semibold text-indigo-600 w-12 text-right">
              {data.serviceRadius} km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3 — Contact & Hours
function StepContact({
  data,
  set,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: OnboardingData[keyof OnboardingData]) => void;
}) {
  function toggleDay(day: string) {
    const days = data.openDays as string[];
    set("openDays", days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  }

  function setAllWeekdays() {
    set("openDays", ["Mon", "Tue", "Wed", "Thu", "Fri"]);
  }

  function setAllDays() {
    set("openDays", DAYS);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
          <Phone className="text-amber-600" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Contact & Hours</h2>
          <p className="text-sm text-slate-500">How customers can reach you</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Primary Phone"
          id="ob-phone"
          type="tel"
          placeholder="9876543210"
          value={data.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field
          label="Alternate Phone"
          id="ob-altphone"
          type="tel"
          placeholder="Optional"
          value={data.altPhone}
          onChange={(v) => set("altPhone", v)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Globe size={15} className="text-slate-400 shrink-0" />
        <Field
          label="Website / Social Link"
          id="ob-website"
          placeholder="https://yourwebsite.com (optional)"
          value={data.website}
          onChange={(v) => set("website", v)}
        />
      </div>

      {/* Operating Hours */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Operating Days</span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={setAllWeekdays}
              className="text-xs text-indigo-600 hover:underline"
            >
              Mon–Fri
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={setAllDays}
              className="text-xs text-indigo-600 hover:underline"
            >
              All 7
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                (data.openDays as string[]).includes(day)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Opens At</label>
          <input
            type="time"
            value={data.openTime}
            onChange={(e) => set("openTime", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Closes At</label>
          <input
            type="time"
            value={data.closeTime}
            onChange={(e) => set("closeTime", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

// Step 4 — Services
function StepServices({
  data,
  set,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: OnboardingData[keyof OnboardingData]) => void;
}) {
  const services = data.services as ServiceEntry[];

  function addService() {
    set("services", [
      ...services,
      { id: `s${Date.now()}`, name: "", price: "", unit: "per visit" },
    ]);
  }

  function removeService(id: string) {
    if (services.length <= 1) return;
    set("services", services.filter((s) => s.id !== id));
  }

  function updateService(id: string, field: keyof ServiceEntry, value: string) {
    set(
      "services",
      services.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
          <Briefcase className="text-purple-600" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Your Services</h2>
          <p className="text-sm text-slate-500">Add what you offer — you can expand this later</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {services.map((svc, idx) => (
          <div
            key={svc.id}
            className="flex flex-col gap-2 rounded-xl bg-slate-50 border border-slate-100 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag size={13} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">
                  Service {idx + 1}
                </span>
              </div>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(svc.id)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Electrical wiring & switchboard repair"
              value={svc.name}
              onChange={(e) => updateService(svc.id, "name", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-sm text-slate-400 pointer-events-none">
                    &#8377;
                  </span>
                  <input
                    type="number"
                    placeholder="Price"
                    value={svc.price}
                    onChange={(e) => updateService(svc.id, "price", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <select
                  value={svc.unit}
                  onChange={(e) => updateService(svc.id, "unit", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PRICE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length < 5 && (
        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-indigo-200 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
        >
          <Plus size={16} /> Add Another Service
        </button>
      )}

      <p className="text-xs text-slate-400 text-center">
        You can manage your full service catalog from the dashboard after setup.
      </p>
    </div>
  );
}

// Step 5 — Done
function StepDone({ data }: { data: OnboardingData }) {
  const highlights = [
    { icon: <Building2 size={15} className="text-indigo-500" />, label: data.businessName || "Your Business" },
    { icon: <MapPin size={15} className="text-emerald-500" />, label: data.city ? `${data.locality}, ${data.city}` : "Location set" },
    { icon: <Briefcase size={15} className="text-purple-500" />, label: `${(data.services as ServiceEntry[]).filter((s) => s.name).length} service(s) added` },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200">
        <Sparkles className="text-indigo-600" size={40} />
        <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-md">
          <CheckCircle2 size={16} className="text-white" />
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">
          You&apos;re all set! 🎉
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
          Your business profile is ready. Head to your dashboard to start managing leads, photos, and reviews.
        </p>
      </div>

      {/* Summary card */}
      <div className="w-full rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={15} className="text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Profile Summary</span>
        </div>
        <div className="flex flex-col gap-2">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-2 text-sm text-slate-700">
              {h.icon}
              <span>{h.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Star size={15} className="text-amber-500" />
            <span>Ready to collect reviews</span>
          </div>
        </div>
      </div>

      {/* What is next */}
      <div className="w-full text-left">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">What to do next</p>
        <ul className="flex flex-col gap-2">
          {[
            "Upload portfolio photos to attract more leads",
            "Complete your services catalog with pricing",
            "Share your profile link with existing customers",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Wizard ───────────────────── */
const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingData, string>>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof OnboardingData>(key: K, val: OnboardingData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof OnboardingData, string>> = {};
    if (step === 1) {
      if (!data.businessName.trim()) e.businessName = "Business name is required";
      if (!data.category) e.category = "Please pick a category";
    }
    if (step === 2) {
      if (!data.address.trim()) e.address = "Address is required";
      if (!data.locality.trim()) e.locality = "Locality is required";
      if (!data.city.trim()) e.city = "City is required";
      if (!data.pincode.trim()) e.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(data.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function finish() {
    setSaving(true);
    // Persist onboarding data alongside mock session
    if (typeof window !== "undefined") {
      const session = JSON.parse(localStorage.getItem("mock_business_user") || "{}");
      localStorage.setItem(
        "mock_business_user",
        JSON.stringify({ ...session, onboardingData: data, onboardingComplete: true })
      );
    }
    await new Promise((r) => setTimeout(r, 800));
    router.push("/business");
  }

  const stepLabels = [
    "Identity",
    "Location",
    "Contact",
    "Services",
    "Complete",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 font-sans antialiased">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-indigo-600" size={22} />
            <span className="text-base font-bold text-slate-800">
              LocalBiz<span className="text-indigo-600">Pro</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/business")}
            className="text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Skip setup &rarr;
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={label} className="flex items-center gap-1">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    done
                      ? "bg-indigo-600 text-white"
                      : active
                      ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <CheckCircle2 size={14} /> : n}
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`h-0.5 w-6 rounded-full transition-all ${
                      done ? "bg-indigo-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mb-8">
          {stepLabels.map((label, i) => (
            <span
              key={label}
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                i + 1 === step ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-xl border border-slate-100 p-8">
          {step === 1 && (
            <StepIdentity data={data} set={set} errors={errors} />
          )}
          {step === 2 && (
            <StepLocation data={data} set={set} errors={errors} />
          )}
          {step === 3 && (
            <StepContact data={data} set={set} />
          )}
          {step === 4 && (
            <StepServices data={data} set={set} />
          )}
          {step === 5 && (
            <StepDone data={data} />
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 && step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <span />
            )}

            {step < TOTAL_STEPS - 1 && (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Continue <ArrowRight size={15} />
              </button>
            )}

            {step === TOTAL_STEPS - 1 && (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Finish Setup <ArrowRight size={15} />
              </button>
            )}

            {step === TOTAL_STEPS && (
              <button
                type="button"
                onClick={finish}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60 ml-auto"
              >
                {saving ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Opening Dashboard...
                  </>
                ) : (
                  <>
                    Go to Dashboard <ArrowRight size={15} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Step counter below */}
        <p className="mt-6 text-center text-xs text-slate-400">
          You can update any of this information from your dashboard at any time.
        </p>
      </main>
    </div>
  );
}
