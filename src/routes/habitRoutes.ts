import { Router } from "express";
import { z } from "zod";
import { validateBody, validateParams } from "../middleware/validation.ts";

const router = Router();
const createHabitSchema = z.object({
  name: z.string(),
});

const completeParamsSchema = z.object({
  id: z.string(),
});

router.get("/", (req, res) => {
  res.json({ message: "habits" });
});

router.get("/id", (req, res) => {
  res.json({ message: "got one habit" });
});

router.post("/", validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ message: "created habit" });
});

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
