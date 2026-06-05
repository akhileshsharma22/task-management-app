import { CheckCircle2, CirclePlus, Pencil, Trash2 } from "lucide-react";
import { memo } from "react";

const config = {
  created: { label: "created", icon: CirclePlus, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" },
  updated: { label: "updated", icon: Pencil, color: "text-sky-600 bg-sky-50 dark:bg-sky-500/10" },
  deleted: { label: "deleted", icon: Trash2, color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10" },
  status_changed: { label: "changed status of", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
};

function ActivityPanel({ activities }) {
  return <aside className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900"><h2 className="font-bold tracking-tight">Recent activity</h2><p className="mt-0.5 text-xs text-slate-500">Your latest workspace actions</p><div className="mt-5 space-y-4">{activities.length ? activities.map((activity) => <ActivityItem key={activity._id} activity={activity} />) : <p className="py-8 text-center text-sm text-slate-400">Your activity will appear here.</p>}</div></aside>;
}

function ActivityItem({ activity }) {
  const item = config[activity.action];
  const Icon = item.icon;
  const time = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const minutes = Math.round((new Date(activity.createdAt) - new Date()) / 60000);
  const relative = Math.abs(minutes) < 60 ? time.format(minutes, "minute") : time.format(Math.round(minutes / 60), "hour");
  return <div className="flex gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-lg ${item.color}`}><Icon size={14} /></span><div className="min-w-0"><p className="text-xs leading-5 text-slate-500">You {item.label} <strong className="font-semibold text-slate-800 dark:text-slate-200">{activity.taskTitle}</strong></p><p className="text-[10px] text-slate-400">{relative}</p></div></div>;
}

export default memo(ActivityPanel);
