import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  members: defineTable({
    userId: v.id("users"),
    memberName: v.string(),
    memberEmail: v.string(),
    role: v.string(),
    isActive: v.boolean(),
  }).index("by_user_id", ["userId"]),

  lists: defineTable({
    userId: v.id("users"),
    listName: v.string(),
    listDate: v.number(),
    payerMemberId: v.id("members"),
    totalAmount: v.number(),
    totalItems: v.number(),
    isSettled: v.boolean(),
    notes: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_date", ["userId", "listDate"])
    .index("by_payer_member_id", ["payerMemberId"]),

  items: defineTable({
    listId: v.id("lists"),
    userId: v.id("users"),
    itemName: v.string(),
    category: v.optional(v.string()),
    quantity: v.optional(v.number()),
    totalItemPrice: v.float64(),
    owners: v.array(v.string()),
  })
    .index("by_list_id", ["listId"])
    .index("by_user_id", ["userId"])
    .index("by_user_category", ["category"]),

  itemSplits: defineTable({
    itemId: v.id("items"),
    listId: v.id("lists"),
    userId: v.id("users"),
    memberId: v.id("members"),
    shareAmount: v.float64(),
    isPaid: v.optional(v.boolean()),
    note: v.optional(v.string()),
  })
    .index("by_item_id", ["itemId"])
    .index("by_list_id", ["listId"])
    .index("by_member_id", ["memberId"])
    .index("by_list_member", ["listId", "memberId"])
    .index("by_user_id", ["userId"]),

  shareLinks: defineTable({
    token: v.string(), // unique random string
    tripId: v.id("trips"),
    createdBy: v.string(), // Clerk userId
    expiresAt: v.number(), // timestamp (ms)
  }).index("by_token", ["token"]),
});
