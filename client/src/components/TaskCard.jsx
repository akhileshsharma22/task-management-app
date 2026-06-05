import { AlertTriangle, CalendarDays, Check, Circle, Clock3, Pencil, Trash2 } from "lucide-react";
import { memo } from "react";

const priorityStyles = {
  low: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  high: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};

function getDeadline(deadline, completed) {
  if (!deadline || completed) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [year, month, day] = deadline.slice(0, 10).split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const days = Math.ceil((due - today) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, urgent: true, near: false };
  if (days === 0) return { text: "Due today", urgent: true, near: false };
  if (days <= 3) return { text: `${days}d remaining`, urgent: false, near: true };
  return { text: `${days}d remaining`, urgent: false, near: false };
}

function TaskCard({ task, onEdit, onDelete, onToggle, busy }) {
  const complete = task.status === "completed";
  const deadline = getDeadline(task.deadline, complete);
  const formatDate = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

  return (
    <article className={`group animate-fade-up rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-900 ${deadline?.urgent ? "border-rose-300 dark:border-rose-500/40" : deadline?.near ? "border-amber-300 dark:border-amber-500/40" : "hover:border-indigo-200 dark:hover:border-indigo-500/30"}`}>
      <div className="flex items-start gap-3">
        <button className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${complete ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-indigo-500 dark:border-slate-600"}`} onClick={() => onToggle(task)} disabled={busy} aria-label={complete ? `Mark ${task.title} pending` : `Mark ${task.title} completed`}>
          {complete ? <Check size={14} strokeWidth={3} /> : <Circle size={10} className="opacity-0" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><h3 className={`font-semibold leading-6 ${complete ? "text-slate-400 line-through" : ""}`}>{task.title}</h3><span className={`status-badge shrink-0 ${complete ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}><span className={`size-1.5 rounded-full ${complete ? "bg-emerald-500" : "bg-slate-400"}`} />{complete ? "Completed" : "Pending"}</span></div>
          <div className="mt-2 flex flex-wrap gap-2"><span className={`status-badge capitalize ${priorityStyles[task.priority || "medium"]}`}>{task.priority || "medium"} priority</span>{deadline && <span className={`status-badge ${deadline.urgent ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" : deadline.near ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}><AlertTriangle size={11} />{deadline.text}</span>}</div>
          {task.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{task.description}</p>}
          <div className="mt-4 border-t pt-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400"><span className="flex items-center gap-1.5"><CalendarDays size={13} />Created {formatDate(task.createdAt)}</span><span className="flex items-center gap-1.5"><Clock3 size={13} />Updated {formatDate(task.updatedAt)}</span></div>
            <div className="mt-3 flex justify-end"><div className="flex opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><button className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={16} /></button><button className="icon-btn hover:text-rose-500 dark:hover:text-rose-400" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button></div></div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(TaskCard);
