import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(), // Stored in cents
  date: timestamp("date").defaultNow(),
  imagePath: text("image_path"),
  processed: boolean("processed").default(false),
});

export const insertReceiptSchema = createInsertSchema(receipts).pick({
  userId: true,
  amount: true,
  imagePath: true,
});

export const receiptItems = pgTable("receipt_items", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").notNull(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(), // Stored in cents
  ecoFriendly: boolean("eco_friendly").default(false),
});

export const insertReceiptItemSchema = createInsertSchema(receiptItems).pick({
  receiptId: true,
  name: true,
  amount: true,
  ecoFriendly: true,
});

export const greenScores = pgTable("green_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  week: integer("week").notNull(),
  year: integer("year").notNull(),
});

export const insertGreenScoreSchema = createInsertSchema(greenScores).pick({
  userId: true,
  score: true,
  week: true,
  year: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type ReceiptItem = typeof receiptItems.$inferSelect;
export type InsertReceiptItem = z.infer<typeof insertReceiptItemSchema>;
export type GreenScore = typeof greenScores.$inferSelect;
export type InsertGreenScore = z.infer<typeof insertGreenScoreSchema>;
