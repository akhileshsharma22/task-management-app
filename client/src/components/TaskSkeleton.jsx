export default function TaskSkeleton() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="flex gap-3">
        <div className="skeleton size-6 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-5 w-2/3 rounded-md" />
          <div className="skeleton h-3 w-full rounded-md" />
          <div className="skeleton h-3 w-4/5 rounded-md" />
          <div className="flex justify-between pt-3"><div className="skeleton h-4 w-24 rounded-md" /><div className="skeleton h-7 w-20 rounded-md" /></div>
        </div>
      </div>
    </div>
  );
}
