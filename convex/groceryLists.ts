import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addList = mutation({
  args: {
    listId: v.string(),
    userId: v.string(),
    date: v.number(),
    shopperId: v.string(), // Reference to the member who paid (memberId)
    note: v.optional(v.string()), // Additional notes related to the grocery list
  },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("groceryLists")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .first();

    const shopper = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("memberId"), args.shopperId))
      .first();

    if (!existingList && shopper) {
      await ctx.db.insert("groceryLists", {
        listId: args.listId,
        userId: args.userId,
        date: args.date,
        shopperId: shopper?.memberId,
        note: args.note,
        itemsAmount: 0,
        totalPrice: 0,
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    console.log("List added successfully");
  },
});

export const updateList = mutation({
  args: {
    listId: v.string(),
    itemAmount: v.number(),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("groceryLists")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .first();

    if (existingList) {
      await ctx.db.patch(existingList._id, {
        itemsAmount: args.itemAmount,
        totalPrice: args.totalPrice,
      });
    }

    console.log("List updated successfully");
  },
});

export const deleteList = mutation({
  args: { listId: v.string() },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("groceryLists")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .first();

    if (existingList) {
      await ctx.db.delete(existingList._id);
    }

    console.log("List deleted successfully");
  },
});

export const bulkDeleteLists = mutation({
  args: { listIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    for (const listId of args.listIds) {
      const existingList = await ctx.db
        .query("groceryLists")
        .filter((q) => q.eq(q.field("listId"), listId))
        .first();

      if (existingList) {
        await ctx.db.delete(existingList._id);
      }
    }

    console.log("Lists deleted successfully");
  },
});

export const getLists = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const lists = await ctx.db
      .query("groceryLists")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (!lists) return null;

    return lists;
  },
});

export const getListById = query({
  args: { listId: v.string() },

  handler: async (ctx, args) => {
    if (!args.listId) return null;

    const list = await ctx.db
      .query("groceryLists")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .first();

    if (!list) return null;

    return list;
  },
});
