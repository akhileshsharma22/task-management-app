import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid task id");
const taskFields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000),
  status: z.enum(["pending", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.union([z.string().date(), z.literal(""), z.null()]),
};

export const createTaskSchema = z.object({
  body: z.object(taskFields).partial().required({ title: true }).transform((body) => ({
    description: "",
    status: "pending",
    priority: "medium",
    ...body,
  })),
});

export const updateTaskSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object(taskFields)
    .partial()
    .refine((body) => Object.keys(body).length > 0, "At least one field is required"),
});

export const taskIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listTasksSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional().default(""),
    status: z.enum(["all", "pending", "completed"]).optional().default("all"),
    priority: z.enum(["all", "low", "medium", "high"]).optional().default("all"),
    sort: z.enum(["latest", "oldest", "completed", "pending", "priority"]).optional().default("latest"),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(50).optional().default(8),
  }),
});
