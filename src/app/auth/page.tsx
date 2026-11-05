"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

/* ─── Mock auth helpers ─────────────────────────────────────────────────────── */
const MOCK_USER = {
  id: "mock-business-001",
  name: "Ravi Kumar",
  email: "ravi@apexhomecare.in",
  businessName: "Apex Home Care & Electrical Solutions",
  phone: "+91 98765 43210",
};

const MOCK_CREDENTIALS = { email: "ravi@apexhomecare.in", password: "demo1234" };

function saveMockSession(user: typeof MOCK_USER) {
  if (typeof window !== "undefined") {
    localStorage.setItem("mock_business_user", JSON.stringify(user));
  }
}

/* ─── Reusable field ────────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  required?: boolean;
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  rightElement,
  required,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
            icon ? "pl-10" : "pl-3"
          } ${rightElement ? "pr-10" : "pr-3"} ${
            error ? "border-red-400 focus:ring-red-400" : "border-slate-200"
          }`}
        />
        {rightElement && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── SIGN IN form ──────────────────────────────────────────────────────────── */
function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof fieldErrors = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 900));

    if (
      email.toLowerCase() === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password
    ) {
      saveMockSession(MOCK_USER);
      router.push("/business");
    } else {
      setError("Invalid email or password. Try the demo credentials below.");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail(MOCK_CREDENTIALS.email);
    setPassword(MOCK_CREDENTIALS.password);
    setFieldErrors({});
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field
        label="Business Email"
        id="signin-email"
        type="email"
        placeholder="you@business.com"
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
        icon={<Mail size={16} />}
        required
      />
      <Field
        label="Password"
        id="signin-password"
        type={showPw ? "text" : "password"}
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
        icon={<Lock size={16} />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        required
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={fillDemo}
        className="text-xs text-indigo-600 hover:underline text-left"
      >
        🎭 Use demo credentials (ravi@apexhomecare.in / demo1234)
      </button>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing in...
          </>
        ) : (
          <>
            Sign In <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-indigo-600 hover:underline"
        >
          Register your business
        </button>
      </p>
    </form>
  );
}

/* ─── SIGN UP form ──────────────────────────────────────────────────────────── */
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [success, setSuccess] = useState(false);

  function set(key: keyof typeof form) {
    return (val: string) => setForm((f) => ({ ...f, [key]: val }));
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, "")))
      e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    const newUser = {
      id: `mock-${Date.now()}`,
      name: form.name,
      email: form.email,
      businessName: form.businessName || `${form.name}s Business`,
      phone: form.phone,
    };
    saveMockSession(newUser);
    setSuccess(true);

    await new Promise((r) => setTimeout(r, 1500));
    router.push("/business");
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="text-emerald-500" size={56} />
        <h3 className="text-lg font-bold text-slate-800">Account created!</h3>
        <p className="text-sm text-slate-500">Redirecting you to your business dashboard...</p>
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Your Full Name"
        id="reg-name"
        placeholder="Ravi Kumar"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
        icon={<User size={16} />}
        required
      />
      <Field
        label="Business Name"
        id="reg-business"
        placeholder="e.g. Apex Home Care (optional)"
        value={form.businessName}
        onChange={set("businessName")}
        icon={<Building2 size={16} />}
      />
      <Field
        label="Business Email"
        id="reg-email"
        type="email"
        placeholder="you@business.com"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
        icon={<Mail size={16} />}
        required
      />
      <Field
        label="Mobile Number"
        id="reg-phone"
        type="tel"
        placeholder="9876543210"
        value={form.phone}
        onChange={set("phone")}
        error={errors.phone}
        icon={<Phone size={16} />}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Password"
          id="reg-password"
          type={showPw ? "text" : "password"}
          placeholder="Min 8 chars"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          icon={<Lock size={16} />}
          rightElement={
            <button type="button" onClick={() => setShowPw((p) => !p)} className="text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          required
        />
        <Field
          label="Confirm Password"
          id="reg-confirm"
          type={showConfirm ? "text" : "password"}
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
          icon={<Lock size={16} />}
          rightElement={
            <button type="button" onClick={() => setShowConfirm((p) => !p)} className="text-slate-400 hover:text-slate-600">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          required
        />
      </div>

      <p className="text-xs text-slate-400">
        By registering you agree to our{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline">Terms of Service</span>{" "}
        and{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline">Privacy Policy</span>.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Creating account...
          </>
        ) : (
          <>
            Create Business Account <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already registered?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-indigo-600 hover:underline"
        >
          Sign in here
        </button>
      </p>
    </form>
  );
}

/* ─── Trust badges ──────────────────────────────────────────────────────────── */
const TRUST = [
  { icon: <ShieldCheck size={18} className="text-indigo-500" />, label: "Verified Listings" },
  { icon: <Star size={18} className="text-amber-500" />, label: "4.8 Avg Rating" },
  { icon: <Users size={18} className="text-emerald-500" />, label: "12,000+ Businesses" },
];

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 font-sans antialiased flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="text-indigo-600" size={24} />
            <span className="text-lg font-bold text-slate-800">
              LocalBiz<span className="text-indigo-600">Pro</span>
            </span>
          </Link>
          <Link
            href="/business"
            className="text-sm text-slate-500 hover:text-indigo-600 transition"
          >
            Go to Dashboard &rarr;
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 lg:py-16">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">

          {/* Left — marketing panel */}
          <div className="hidden lg:flex flex-col gap-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
                <ShieldCheck size={12} /> Trusted by local businesses across India
              </span>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
                Grow your business.<br />
                <span className="text-indigo-600">Connect with customers.</span>
              </h1>
              <p className="mt-4 text-base text-slate-500 leading-relaxed">
                Join thousands of local service providers who manage leads, showcase their
                work, and build trust with verified reviews — all from one dashboard.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {TRUST.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2 rounded-xl bg-white border border-slate-100 px-4 py-2.5 shadow-sm"
                >
                  {t.icon}
                  <span className="text-sm font-medium text-slate-700">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <ul className="flex flex-col gap-3">
              {[
                "Manage enquiries and convert leads",
                "Showcase portfolio with photos & certificates",
                "Get discovered by nearby customers",
                "Reply to reviews and build credibility",
                "Track analytics — impressions, clicks, calls",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Testimonial */}
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
              <p className="text-sm italic text-slate-600 leading-relaxed">
                After listing on LocalBizPro, our enquiries doubled in the first month. The
                dashboard makes it so easy to follow up with leads.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-200 text-sm font-bold text-indigo-700">
                  RK
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Ravi Kumar</p>
                  <p className="text-xs text-slate-400">Apex Home Care, Bengaluru</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — auth card */}
          <div className="w-full">
            <div className="rounded-2xl bg-white shadow-xl border border-slate-100 p-8">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <Building2 className="text-indigo-600" size={22} />
                <span className="text-base font-bold text-slate-800">
                  LocalBiz<span className="text-indigo-600">Pro</span>
                </span>
              </div>

              {/* Tab switcher */}
              <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setTab("signin")}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                    tab === "signin"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                    tab === "signup"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Heading */}
              <div className="mb-6">
                {tab === "signin" ? (
                  <>
                    <h2 className="text-xl font-bold text-slate-800">Welcome back!</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Sign in to access your business dashboard.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-800">List your business</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Create your free account and start getting leads today.
                    </p>
                  </>
                )}
              </div>

              {/* Form */}
              {tab === "signin" ? (
                <SignInForm onSwitch={() => setTab("signup")} />
              ) : (
                <SignUpForm onSwitch={() => setTab("signin")} />
              )}
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Your data is safe. We never share your information.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-5">
        <p className="text-center text-xs text-slate-400">
          2024 LocalBizPro - Built for local service businesses across India
        </p>
      </footer>
    </div>
  );
}
