import { db } from "./connection.ts";
import { users, habits, entries, tags, habitTags } from "./schema.ts";
import { fileURLToPath } from "node:url";

const seed = async () => {
  console.log("Starting DB seed");

  try {
    console.log("Clearing existing data");
    await db.delete(entries);
    await db.delete(habitTags);
    await db.delete(habits);
    await db.delete(tags);
    await db.delete(users);

    console.log("Creating demo users...");
    const [demoUser] = await db
      .insert(users)
      .values({
        email: "demo@app.com",
        password: "12345",
        firstName: "demo",
        lastName: "person",
        username: "demo",
      })
      .returning();

    console.log("Creating tags...");
    const [healthTags] = await db
      .insert(tags)
      .values({
        name: "Health",
        color: "#ff0000",
      })
      .returning(); // Returning is required to get the rows inserted or else it will just return the metadata on the operation itself

    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: "exercise",
        description: "daily workout",
        frequency: "daily",
        targetCount: 1,
      })
      .returning();

    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTags.id,
    });

    console.log("Adding completion entries...");
    const today = new Date();
    today.setHours(12, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
      });
    }

    console.log(`Database seeded successfully`);
    console.log(`user credentials`);
    console.log(`email: ${demoUser.email}`);
    console.log(`username: ${demoUser.username}`);
    console.log(`password: ${demoUser.password}`);
  } catch (e) {
    console.error("seed failed", e);
    process.exit(1);
  }
};
console.log(
  "Seed",
  fileURLToPath(import.meta.url),
  process.argv[1],
  fileURLToPath(import.meta.url) === process.argv[1],
  import.meta.url === process.argv[1],
);

if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  console.log("Starting seed");
  seed()
    .then(() => process.exit(0))
    .catch((e) => process.exit(1));
}

export default seed;
