import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { db } from "../db/connection.ts";
import { habits, entries, habitTags, tags } from "../db/schema.ts";
import { eq, and, desc, inArray } from "drizzle-orm";

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body;
    const result = await db.transaction(async (tx) => {
      // Create a new habit
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: req.user!.id,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning();

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId) => ({
          habitId: newHabit.id,
          tagId,
        }));

        await tx.insert(habitTags).values(habitTagValues);
      }

      return newHabit;
    });

    res.status(201).json({
      message: "Habit created",
      habit: result,
    });
  } catch (e) {
    console.error("Create habit error", e);
    res.status(500).json({
      error: "Failed to create habit",
    });
  }
};

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userHabitWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user!.id),
      with: {
        habitTags: {
          with: {
            tag: true, // true means include the tag field
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    });

    const habitsWithTags = userHabitWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined, // anything that is undefined when JSON.stringified gets removed over the wire
    }));

    res.json({
      habits: habitsWithTags,
    });
  } catch (e) {
    console.error("Failed to get user habits", e);
    res.status(500).json({
      message: "Failed to get habits",
    });
  }
};
