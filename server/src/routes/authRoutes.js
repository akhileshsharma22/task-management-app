import { Router } from "express";
import { getMe, login, register, updatePassword, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema, updatePasswordSchema, updateProfileSchema } from "../validators/authValidators.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, validate(updateProfileSchema), updateProfile);
router.patch("/password", protect, validate(updatePasswordSchema), updatePassword);

export default router;
