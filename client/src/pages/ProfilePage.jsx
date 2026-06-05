import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, CheckCircle2, KeyRound, ListTodo, Mail, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { api, errorMessage } from "../lib/api";

const profileSchema = z.object({ name: z.string().trim().min(2, "Use at least 2 characters").max(60) });
const passwordSchema = z.object({ currentPassword: z.string().min(1, "Enter your current password"), newPassword: z.string().min(8, "Use at least 8 characters").regex(/[A-Z]/, "Add an uppercase letter").regex(/[a-z]/, "Add a lowercase letter").regex(/\d/, "Add a number") });

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, completionPercentage: 0 });
  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user.name } });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "" } });

  useEffect(() => { api.get("/auth/me").then(({ data }) => setStats(data.data.stats)).catch(() => {}); }, []);

  const saveProfile = async (values) => {
    try { const { data } = await api.patch("/auth/profile", values); updateUser(data.data.user); toast.success("Profile updated"); }
    catch (error) { toast.error(errorMessage(error)); }
  };
  const savePassword = async (values) => {
    try { await api.patch("/auth/password", values); passwordForm.reset(); toast.success("Password updated"); }
    catch (error) { toast.error(errorMessage(error)); }
  };

  return <main className="min-h-screen">
    <header className="border-b bg-white/85 backdrop-blur dark:bg-slate-950/85"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"><Link to="/dashboard" className="flex items-center gap-2 font-bold"><span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white"><ListTodo size={18} /></span>Momentum</Link><ThemeToggle /></div></header>
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} />Back to dashboard</Link><div className="mt-6"><h1 className="text-3xl font-extrabold tracking-tight">Profile settings</h1><p className="mt-2 text-sm text-slate-500">Manage your account details and security.</p></div>
      <section className="mt-8 grid gap-4 sm:grid-cols-3"><ProfileStat icon={ListTodo} label="Total tasks" value={stats.total} /><ProfileStat icon={CheckCircle2} label="Completed" value={stats.completed} /><ProfileStat icon={UserRound} label="Completion rate" value={`${stats.completionPercentage}%`} /></section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900"><h2 className="font-bold">Personal information</h2><div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-950"><p className="flex items-center gap-2 text-slate-500"><Mail size={15} />{user.email}</p><p className="flex items-center gap-2 text-slate-500"><CalendarDays size={15} />Member since {new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user.createdAt))}</p></div><form className="mt-5" onSubmit={profileForm.handleSubmit(saveProfile)}><label className="text-sm font-medium">Display name<input className="field mt-1.5" {...profileForm.register("name")} /></label><p className="mt-1 text-xs text-rose-500">{profileForm.formState.errors.name?.message}</p><button className="btn-primary mt-4" disabled={profileForm.formState.isSubmitting}><Save size={16} />Save profile</button></form></div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900"><h2 className="font-bold">Change password</h2><p className="mt-1 text-xs text-slate-500">Use a strong, unique password for your account.</p><form className="mt-5 space-y-4" onSubmit={passwordForm.handleSubmit(savePassword)}><ProfileField label="Current password" name="currentPassword" form={passwordForm} /><ProfileField label="New password" name="newPassword" form={passwordForm} /><button className="btn-primary" disabled={passwordForm.formState.isSubmitting}><KeyRound size={16} />Update password</button></form></div>
      </section>
    </div>
  </main>;
}

function ProfileStat({ icon: Icon, label, value }) { return <div className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900"><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"><Icon size={18} /></span><div><p className="text-xl font-extrabold">{value}</p><p className="text-xs text-slate-500">{label}</p></div></div>; }
function ProfileField({ label, name, form }) { return <label className="block text-sm font-medium">{label}<input type="password" className="field mt-1.5" {...form.register(name)} /><span className="mt-1 block text-xs text-rose-500">{form.formState.errors[name]?.message}</span></label>; }
