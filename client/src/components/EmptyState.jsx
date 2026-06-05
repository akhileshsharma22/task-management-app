import { ClipboardCheck, Plus } from "lucide-react";

export default function EmptyState({ searching, completedOnly, onCreate }) {
  const title = completedOnly ? "No completed tasks yet" : searching ? "No matching tasks" : "Your list is clear";
  const message = completedOnly ? "Complete a task and it will appear in this view." : searching ? "Try adjusting your search or filter." : "Create your first task and start building momentum.";
  return (
    <div className="col-span-full grid min-h-72 place-items-center rounded-2xl border border-dashed bg-white/50 p-8 text-center dark:bg-slate-900/40">
      <div className="max-w-sm">
        <div className="relative mx-auto mb-2 h-24 w-32"><div className="absolute inset-x-3 bottom-1 h-12 rounded-full bg-indigo-100/70 blur-xl dark:bg-indigo-500/10" /><div className="absolute left-7 top-4 size-16 rotate-[-8deg] rounded-2xl border bg-white shadow-lg dark:bg-slate-900" /><div className="absolute right-6 top-1 grid size-16 rotate-[8deg] place-items-center rounded-2xl border bg-white text-indigo-600 shadow-lg dark:bg-slate-900 dark:text-indigo-400"><ClipboardCheck size={28} /></div></div>
        <h3 className="mt-4 font-bold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
        {!searching && <button className="btn-primary mt-5" onClick={onCreate}><Plus size={17} />New task</button>}
      </div>
    </div>
  );
}
