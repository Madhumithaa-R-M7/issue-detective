import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, Wrench, Lock, Mail, KeyRound, ArrowRight, CheckCircle2, ChevronLeft, UserPlus, AlertCircle } from "lucide-react";
import { useCivic } from "@/lib/civic/store";
import { loginApi, registerApi } from "@/lib/civic/api";
import type { Role } from "@/lib/civic/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Authentication — CivicConnect Smart Campus Platform" },
      { name: "description", content: "Sign in or register a new account on CivicConnect." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { setRole } = useCivic();
  const navigate = useNavigate();

  // Mode: "login" or "register"
  const [mode, setMode] = useState<"login" | "register">("login");

  // Selected Role for form
  const [role, setSelectedRole] = useState<Role>("student");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("rescuenet.in@gmail.com");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
    setError(null);
    setSuccessMsg(null);
    if (mode === "login") {
      if (r === "admin") setEmail("rescuenet.in@gmail.com");
      else if (r === "student") setEmail("aaryav@civicconnect.edu");
      else if (r === "staff") setEmail("ramesh.kumar@civicconnect.edu");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await loginApi(email.trim().toLowerCase(), password);

      if (result && result.success && result.user) {
        if (result.token) {
          localStorage.setItem("civicconnect_token", result.token);
        }
        const userRole: Role = result.user.role || role;
        setRole(userRole);
        setSuccessMsg(`Welcome back, ${result.user.name || result.user.email}! Redirecting...`);

        setTimeout(() => {
          const dest = userRole === "admin" ? "/admin" : userRole === "staff" ? "/staff" : "/report";
          navigate({ to: dest });
        }, 600);
      } else {
        setError(result?.message || "Invalid credentials. Please check your email and password.");
      }
    } catch (err: any) {
      setError(err?.message || "Connection error. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const result = await registerApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (result && result.success && result.user) {
        if (result.token) {
          localStorage.setItem("civicconnect_token", result.token);
        }
        setRole(result.user.role || role);
        setSuccessMsg("Account created successfully! Logging you in...");

        setTimeout(() => {
          const dest = role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/report";
          navigate({ to: dest });
        }, 700);
      } else {
        // Real duplicate check error message from backend
        setError(result?.message || "Registration failed. Duplicate email ID or invalid data.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to complete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="size-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="brand-gradient grid size-7 place-items-center rounded-lg">
              <ShieldCheck className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display text-sm font-bold text-foreground">CivicConnect</span>
          </div>
        </div>

        {/* Tab Header: Sign In vs Register */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl bg-muted p-1 border border-border">
            <button
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                mode === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="size-3.5" /> Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                mode === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="size-3.5" /> Register New Account
            </button>
          </div>
        </div>

        {/* Role Selector Buttons */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleRoleSelect("student")}
            className={`p-3 rounded-xl border text-center transition-all ${
              role === "student"
                ? "border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary/20"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4 mx-auto mb-1 text-primary" />
            <span className="block text-xs">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("staff")}
            className={`p-3 rounded-xl border text-center transition-all ${
              role === "staff"
                ? "border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary/20"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wrench className="size-4 mx-auto mb-1 text-primary" />
            <span className="block text-xs">Maintenance Staff</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("admin")}
            className={`p-3 rounded-xl border text-center transition-all ${
              role === "admin"
                ? "border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary/20"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="size-4 mx-auto mb-1 text-primary" />
            <span className="block text-xs">Administrator</span>
          </button>
        </div>

        {/* Auth Form Card */}
        <div className="mx-auto max-w-lg card-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="brand-gradient grid size-10 place-items-center rounded-xl text-primary-foreground">
              {mode === "login" ? <Lock className="size-5" /> : <UserPlus className="size-5" />}
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                {mode === "login" ? `Sign In (${role.toUpperCase()})` : `Create New ${role.toUpperCase()} Account`}
              </h2>
              <p className="text-xs text-muted-foreground">
                {mode === "login"
                  ? "Enter your registered email ID and password"
                  : "Fill in your details to create an account in MongoDB"}
              </p>
            </div>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-xs text-destructive font-medium border border-destructive/20">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email Address / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl brand-gradient py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : mode === "login" ? (
                <>Sign In <ArrowRight className="size-4" /></>
              ) : (
                <>Create Account <UserPlus className="size-4" /></>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-bold text-primary underline"
                >
                  Register Here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-bold text-primary underline"
                >
                  Sign In Here
                </button>
              </p>
            )}
          </div>
        </div>

      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        CivicConnect · Smart Campus Civic Issue Reporting & Image Verification Platform
      </footer>
    </div>
  );
}
