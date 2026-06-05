import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validators/taskValidators.js";

const router = Router();
router.use(protect);

router.route("/").get(validate(listTasksSchema), getTasks).post(validate(createTaskSchema), createTask);
router
  .route("/:id")
  .patch(validate(updateTaskSchema), updateTask)
  .delete(validate(taskIdSchema), deleteTask);

export default router;
