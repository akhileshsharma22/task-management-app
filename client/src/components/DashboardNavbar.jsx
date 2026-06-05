import { ChevronDown, LayoutDashboard, ListTodo, LogOut, Search, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function DashboardNavbar({ user, search, onSearch, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => !menuRef.current?.contains(event.target) && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur-xl dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20"><ListTodo size={19} /></span>
          <span className="hidden sm:block">Momentum</span>
        </div>
        <label className="relative mx-auto hidden w-full max-w-xl md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input className="field border-transparent bg-slate-100/80 pl-10 shadow-none dark:bg-slate-900" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search tasks by title or description..." />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-400 dark:bg-slate-800 lg:block">⌘ K</kbd>
        </label>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <div className="relative ml-1" ref={menuRef}>
            <button className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setMenuOpen((open) => !open)} aria-label="Open profile menu">
              <span className="grid size-8 place-items-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{initials}</span>
              <span className="hidden text-left lg:block"><span className="block max-w-28 truncate text-xs font-semibold">{user.name}</span><span className="block text-[10px] text-slate-400">Workspace member</span></span>
              <ChevronDown size={14} className="hidden text-slate-400 lg:block" />
            </button>
            {menuOpen && <div className="absolute right-0 mt-2 w-64 animate-fade-up rounded-2xl border bg-white p-2 shadow-soft dark:bg-slate-900">
              <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                <span className="grid size-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><UserRound size={18} /></span>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-slate-400">{user.email}</p></div>
              </div>
              <div className="my-1 border-t" />
              <Link className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800" to="/dashboard" onClick={() => setMenuOpen(false)}><LayoutDashboard size={16} />Dashboard</Link>
              <Link className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800" to="/profile" onClick={() => setMenuOpen(false)}><UserRound size={16} />Profile settings</Link>
              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={onLogout}><LogOut size={16} />Sign out</button>
            </div>}
          </div>
        </div>
      </div>
    </header>
  );
}
