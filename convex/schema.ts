import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Unique identifier for the user
    email: v.string(), // User's email address
    name: v.string(), // User's display name
    role: v.string(), // Role of the user
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_user_id", ["userId"]),

  members: defineTable({
    memberId: v.string(), // Unique identifier for the member
    userId: v.string(), // Reference to the user who created the member
    memberName: v.string(), // Name of the member
    memberEmail: v.string(), // Email address of the member
    role: v.string(), // Role of the member
    createdAt: v.optional(v.number()), // Timestamp when the member was created
  }).index("by_user_id", ["userId"]),
});
