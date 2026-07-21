import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // what we put inside uuid() will be what the name of the field in the db be
  email: varchar("email", { length: 255 }).notNull().unique(), // .unique() is the way to create an index
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("created_at").defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // If a user that this thing is referencing gets delted , then cascade it
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 20 }).notNull(),
  targetCount: integer("target_count").default(1),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("created_at").defaultNow().notNull(),
});

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completionDate: timestamp("completion_date").defaultNow().notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).default("#6b7280"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitTags = pgTable("habitTags", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }),
});
