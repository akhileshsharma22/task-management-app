import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(1000),
  status: z.enum(["pending", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.string().optional(),
});

export default function TaskForm({ task, onSubmit, onCancel }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", status: "pending", priority: "medium", deadline: "" },
  });
  const title = watch("title") || "";
  const description = watch("description") || "";

  useEffect(() => {
    reset(task ? { title: task.title, description: task.description || "", status: task.status, priority: task.priority || "medium", deadline: task.deadline?.slice(0, 10) || "" } : { title: "", description: "", status: "pending", priority: "medium", deadline: "" });
  }, [task, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="block text-sm font-medium">Title
        <input className="field mt-1.5" placeholder="What needs to get done?" {...register("title")} autoFocus />
        <span className="mt-1 flex justify-between text-xs"><span className="text-rose-500">{errors.title?.message}</span><span className="text-slate-400">{title.length}/120</span></span>
      </label>
      <label className="block text-sm font-medium">Description
        <textarea className="field mt-1.5 min-h-28 resize-y" placeholder="Add useful details..." {...register("description")} />
        <span className="mt-1 flex justify-between text-xs"><span className="text-rose-500">{errors.description?.message}</span><span className="text-slate-400">{description.length}/1000</span></span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Status
        <select className="field mt-1.5" {...register("status")} aria-label="Task status">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label><label className="block text-sm font-medium">Priority<select className="field mt-1.5" {...register("priority")} aria-label="Task priority"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label></div>
      <label className="block text-sm font-medium">Deadline <span className="font-normal text-slate-400">(optional)</span><input type="date" className="field mt-1.5" {...register("deadline")} /></label>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : task ? "Save changes" : "Create task"}</button>
      </div>
    </form>
  );
}
