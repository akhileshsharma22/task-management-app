import { ArrowDownUp, CalendarCheck2, CalendarPlus2, CheckCircle2, ChevronLeft, ChevronRight, CircleDashed, LayoutList, Plus, Search, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import DashboardNavbar from "../components/DashboardNavbar";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import TaskSkeleton from "../components/TaskSkeleton";
import AnalyticsCharts from "../components/AnalyticsCharts";
import ActivityPanel from "../components/ActivityPanel";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { useTasks } from "../hooks/useTasks";
import { useAnalytics } from "../hooks/useAnalytics";

const statusOptions = ["all", "pending", "completed"];
const sortOptions = [
  { value: "latest", label: "Latest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "completed", label: "Completed first" },
  { value: "pending", label: "Pending first" },
  { value: "priority", label: "Priority" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const debouncedSearch = useDebounce(search);
  const filters = useMemo(() => ({ search: debouncedSearch, status, priority, sort, page }), [debouncedSearch, status, priority, sort, page]);
  const { tasks, pagination, loading, refreshing, busyId, mutationVersion, createTask, updateTask, deleteTask } = useTasks(filters);
  const { analytics, loading: analyticsLoading } = useAnalytics(mutationVersion);
  const stats = analytics?.stats || { total: 0, completed: 0, pending: 0, completionPercentage: 0, tasksCreatedThisWeek: 0, tasksCompletedThisWeek: 0 };

  const updateSearch = (value) => { setSearch(value); setPage(1); };
  const updateStatus = (value) => { setStatus(value); setPage(1); };
  const updateSort = (value) => { setSort(value); setPage(1); };
  const updatePriority = (value) => { setPriority(value); setPage(1); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };
  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const handleLogout = () => { logout(); navigate("/login"); toast.success("Signed out successfully"); };

  const saveTask = async (values) => {
    const succeeded = editing ? await updateTask(editing, values) : await createTask(values);
    if (succeeded) closeForm();
  };

  const confirmDelete = async () => {
    if (await deleteTask(deleting)) setDeleting(null);
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar user={user} search={search} onSearch={updateSearch} onLogout={handleLogout} />
      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400"><Sparkles size={14} />Personal workspace</div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Good to see you, {user.name.split(" ")[0]}.</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Here is what is happening with your tasks today.</p>
          </div>
          <button className="btn-primary self-start sm:self-auto" onClick={openCreate}><Plus size={18} />Create task</button>
        </section>

        {analyticsLoading ? <div className="mt-8"><DashboardSkeleton /></div> : <>
        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total tasks" value={stats.total} detail="Across your workspace" icon={LayoutList} tone="indigo" />
          <StatCard label="Completed" value={stats.completed} detail={`${stats.completionPercentage}% completion rate`} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Pending" value={stats.pending} detail={stats.pending ? "Ready for your attention" : "Nothing left behind"} icon={CircleDashed} tone="amber" />
          <StatCard label="Created this week" value={stats.tasksCreatedThisWeek} detail="During the last 7 days" icon={CalendarPlus2} tone="indigo" />
          <StatCard label="Completed this week" value={stats.tasksCompletedThisWeek} detail="During the last 7 days" icon={CalendarCheck2} tone="emerald" />
          <ProgressCard percentage={stats.completionPercentage} />
        </section>
        <AnalyticsCharts statusDistribution={analytics.statusDistribution} weeklyActivity={analytics.weeklyActivity} />
        </>}

        <section className="mt-8 rounded-2xl border bg-white/70 shadow-sm dark:bg-slate-900/60">
          <div className="border-b p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div><h2 className="font-bold tracking-tight">Your tasks</h2><p className="mt-0.5 text-xs text-slate-500">{pagination.total} task{pagination.total === 1 ? "" : "s"} in this view</p></div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative md:hidden"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="field pl-10" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Search tasks..." /></label>
                <div className="flex rounded-xl border bg-slate-50 p-1 dark:bg-slate-950">
                  {statusOptions.map((option) => <button key={option} onClick={() => updateStatus(option)} className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition sm:flex-none ${status === option ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}>{option}</button>)}
                </div>
                <label className="relative">
                  <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <select className="field min-w-40 py-2 pl-9" value={sort} onChange={(event) => updateSort(event.target.value)}>{sortOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
                </label>
                <select className="field min-w-36 py-2" value={priority} onChange={(event) => updatePriority(event.target.value)} aria-label="Filter tasks by priority"><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select>
              </div>
            </div>
          </div>

          <div className="relative p-4 sm:p-5">
            {refreshing && <div className="absolute right-5 top-2 size-2 animate-pulse rounded-full bg-indigo-500" title="Syncing tasks" />}
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {loading ? Array.from({ length: 6 }, (_, index) => <TaskSkeleton key={index} />) : tasks.length ? tasks.map((task) => <TaskCard key={task._id} task={task} busy={busyId === task._id} onToggle={(value) => updateTask(value, { status: value.status === "completed" ? "pending" : "completed" }, value.status === "completed" ? "Task moved to pending" : "Task completed")} onEdit={(value) => { setEditing(value); setFormOpen(true); }} onDelete={setDeleting} />) : <EmptyState searching={Boolean(debouncedSearch || status !== "all")} completedOnly={status === "completed" && !debouncedSearch} onCreate={openCreate} />}
            </div>
          </div>

          {!loading && pagination.pages > 1 && <div className="flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row sm:px-5"><p className="text-xs text-slate-500">Showing page <strong className="text-slate-700 dark:text-slate-300">{pagination.page}</strong> of {pagination.pages}</p><div className="flex items-center gap-2"><button className="btn-secondary px-3 py-2" disabled={pagination.page <= 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={16} />Previous</button><span className="grid size-9 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white">{pagination.page}</span><button className="btn-secondary px-3 py-2" disabled={pagination.page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next<ChevronRight size={16} /></button></div></div>}
        </section>
        {!analyticsLoading && <section className="mt-4"><ActivityPanel activities={analytics.recentActivity} /></section>}
      </main>

      <Modal open={formOpen} onClose={closeForm} title={editing ? "Edit task" : "Create a new task"}><TaskForm task={editing} onSubmit={saveTask} onCancel={closeForm} /></Modal>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={confirmDelete} title="Delete this task?" message={`This will permanently delete "${deleting?.title || ""}". This action cannot be undone.`} busy={busyId === deleting?._id} />
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  const tones = { indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400", emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" };
  return <article className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-900"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}><Icon size={19} /></span></div><p className="mt-3 text-[11px] text-slate-400">{detail}</p></article>;
}

function ProgressCard({ percentage }) {
  return <article className="rounded-2xl border bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-indigo-500/15"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-indigo-100">Overall progress</p><p className="mt-2 text-3xl font-extrabold tracking-tight">{percentage}%</p></div><span className="grid size-10 place-items-center rounded-xl bg-white/15"><Target size={19} /></span></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${percentage}%` }} /></div></article>;
}
