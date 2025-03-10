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

  groceryLists: defineTable({
    listId: v.string(), // Unique identifier for the grocery list (e.g., UUID)
    userId: v.string(), // Reference to the user who created the grocery list
    date: v.number(), // Date of the grocery shopping trip
    shopperId: v.string(), // Reference to the member who paid (memberId)
    note: v.optional(v.string()), // Additional notes related to the grocery list
    itemsAmount: v.number(), // Total number of items in the grocery list
    totalPrice: v.number(), // Total cost of all items in the grocery list
    items: v.array(v.string()), // Array of references to the Groceries table (grocery item IDs)
    createdAt: v.optional(v.number()), // Timestamp when the grocery list was created
    updatedAt: v.optional(v.number()), // Timestamp when the grocery list was last updated
  }).index("by_user_id", ["userId"]),

  groceries: defineTable({
    groceryId: v.string(), // Unique identifier for each grocery item (e.g., UUID)
    listId: v.string(), // Reference to the grocery list this item belongs to
    name: v.string(), // Name of the grocery item
    category: v.string(), // Category of the grocery item (e.g., Dairy, Fruits)
    quantity: v.number(), // Quantity of the grocery item
    price: v.number(), // Price of the grocery item
    owners: v.array(v.string()), // Array of member IDs indicating ownership of the item
    createdAt: v.optional(v.number()), // Timestamp when the grocery item was created
    updatedAt: v.optional(v.number()), // Timestamp when the grocery item was last updated
  }).index("by_list_id", ["listId"]),
});
