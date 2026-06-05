import { ArrowLeft, LockKeyhole, ServerCrash, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const content = {
  unauthorized: { code: "401", title: "Access requires authentication", message: "Your session may have expired. Sign in again to continue.", icon: LockKeyhole, action: "Sign in", to: "/login" },
  forbidden: { code: "403", title: "You cannot access this page", message: "This resource is outside your workspace permissions.", icon: ShieldAlert, action: "Back to dashboard", to: "/dashboard" },
  server: { code: "500", title: "Something went wrong", message: "We could not complete that request. Please try again shortly.", icon: ServerCrash, action: "Back to dashboard", to: "/dashboard" },
};

export default function ErrorPage({ type = "server" }) {
  const item = content[type]; const Icon = item.icon;
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center dark:bg-slate-950"><div className="max-w-md"><div className="relative mx-auto grid size-20 place-items-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"><Icon size={32} /><span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-indigo-600 shadow">{item.code}</span></div><h1 className="mt-7 text-3xl font-extrabold tracking-tight">{item.title}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{item.message}</p><Link className="btn-primary mt-7" to={item.to}><ArrowLeft size={17} />{item.action}</Link></div></main>;
}
