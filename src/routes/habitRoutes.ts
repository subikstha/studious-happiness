import { Router } from "express";
import { z } from "zod";
import { validateBody, validateParams } from "../middleware/validation.ts";
import { authenticateToken } from "../middleware/auth.ts";
import {
  createHabit,
  getUserHabits,
  updateHabit,
} from "../controllers/habitController.ts";
import { insertHabitSchema } from "../db/schema.ts";

const router = Router();

router.use(authenticateToken);
const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.string(),
  tagIds: z.array(z.string()).optional(),
});

const updateHabitSchema = insertHabitSchema.partial().extend({
  tagIds: z.array(z.string()).optional(),
});

const completeParamsSchema = z.object({
  id: z.string(),
});

router.get("/", getUserHabits);

router.patch("/:id", validateBody(updateHabitSchema), updateHabit);

router.get("/id", (req, res) => {
  res.json({ message: "got one habit" });
});

router.post("/", validateBody(createHabitSchema), createHabit);

router.delete("/:id", (req, res) => {
  res.status(204).json({ message: "deleted habit" });
});

router.post(
  "/:id/complete",
  validateParams(completeParamsSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    res.json({ message: "completed habit" }).status(201);
  },
);

export default router;
