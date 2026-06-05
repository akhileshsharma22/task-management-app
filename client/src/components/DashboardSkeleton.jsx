import TaskSkeleton from "./TaskSkeleton";

export default function DashboardSkeleton() {
  return <div aria-label="Loading dashboard" role="status"><span className="sr-only">Loading dashboard</span><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="rounded-2xl border bg-white p-5 dark:bg-slate-900"><div className="skeleton h-3 w-24 rounded" /><div className="skeleton mt-4 h-8 w-16 rounded" /><div className="skeleton mt-4 h-3 w-32 rounded" /></div>)}</div><div className="mt-4 grid gap-4 xl:grid-cols-2"><div className="skeleton h-80 rounded-2xl" /><div className="skeleton h-80 rounded-2xl" /></div><div className="mt-8 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <TaskSkeleton key={index} />)}</div></div>;
}
