import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, ListTodo } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../lib/api";

const schemas = {
  login: z.object({ email: z.string().email(), password: z.string().min(1, "Password is required") }),
  register: z.object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters").max(60, "Name cannot exceed 60 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters").max(72).regex(/[a-z]/, "Add a lowercase letter").regex(/[A-Z]/, "Add an uppercase letter").regex(/\d/, "Add a number"),
  }),
};

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register: field, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schemas[mode]) });
  const password = watch("password") || "";

  useEffect(() => { if (user) navigate("/dashboard", { replace: true }); }, [user, navigate]);

  const submit = async (values) => {
    try {
      await (isRegister ? register(values) : login(values));
      toast.success(isRegister ? "Welcome to Momentum" : "Welcome back");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      <div className="absolute right-5 top-5 z-10"><ThemeToggle /></div>
      <section className="hidden overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold"><span className="grid size-9 place-items-center rounded-xl bg-white/15"><ListTodo size={20} /></span>Momentum</Link>
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Make progress visible</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight">A calmer way to get meaningful work done.</h1>
          <div className="mt-10 space-y-4 text-indigo-100">
            {["Capture tasks before they escape", "Focus with simple status filters", "See your progress at a glance"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 size={18} />{item}</p>)}
          </div>
        </div>
        <p className="text-sm text-indigo-200">Designed for focus. Built for momentum.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-10 flex items-center gap-2 text-lg font-bold lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white"><ListTodo size={20} /></span>Momentum</Link>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{isRegister ? "GET STARTED" : "WELCOME BACK"}</p>
          <h2 className="mt-2 text-3xl font-extrabold">{isRegister ? "Create your account" : "Sign in to your workspace"}</h2>
          <p className="mt-2 text-sm text-slate-500">{isRegister ? "Start organizing your day in under a minute." : "Pick up right where you left off."}</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(submit)}>
            {isRegister && <Field label="Name" name="name" placeholder="Alex Morgan" field={field} error={errors.name} autoComplete="name" />}
            <Field label="Email" name="email" type="email" placeholder="you@example.com" field={field} error={errors.email} autoComplete="email" />
            <Field label="Password" name="password" type="password" placeholder={isRegister ? "At least 8 characters" : "Your password"} field={field} error={errors.password} autoComplete={isRegister ? "new-password" : "current-password"} />
            {isRegister && <PasswordStrength password={password} />}
            <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : <>{isRegister ? "Create account" : "Sign in"}<ArrowRight size={17} /></>}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">{isRegister ? "Already have an account?" : "New to Momentum?"} <Link className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, field, error, ...props }) {
  return <label className="block text-sm font-medium">{label}<input className="field mt-1.5" {...props} {...field(name)} />{error && <span className="mt-1 block text-xs text-rose-500">{error.message}</span>}</label>;
}

function PasswordStrength({ password }) {
  const checks = [password.length >= 8, /[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password)];
  const score = checks.filter(Boolean).length;
  const labels = ["Too weak", "Getting there", "Good", "Strong"];
  const colors = ["bg-slate-200 dark:bg-slate-800", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];
  return <div className="-mt-1"><div className="flex gap-1">{checks.map((passed, index) => <span key={index} className={`h-1 flex-1 rounded-full transition ${passed ? colors[score] : "bg-slate-200 dark:bg-slate-800"}`} />)}</div><p className="mt-1.5 text-[11px] text-slate-400">{labels[score]}: use 8+ characters, mixed case, and a number.</p></div>;
}
