import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLists = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const lists = await ctx.db
      .query("lists")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (!lists) return null;

    return lists;
  },
});

export const addList = mutation({
  args: {
    listId: v.string(),
    userId: v.id("users"),
    name: v.string(),
    date: v.number(),
    shopperId: v.string(), // Reference to the member who paid (memberId)
    note: v.optional(v.string()), // Additional notes related to the grocery list
  },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("_id"), args.listId))
      .first();

    const shopper = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("_id"), args.shopperId))
      .first();

    if (!existingList && shopper) {
      await ctx.db.insert("lists", {
        userId: args.userId,
        listName: args.name,
        listDate: args.date,
        payerMemberId: shopper?._id,
        notes: args.note || "",
        isSettled: false,
        totalAmount: 0,
        totalItems: 0,
      });
    }

    console.log("List added successfully");
  },
});

export const updateListAmount = mutation({
  args: {
    listId: v.string(),
    itemAmount: v.number(),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("_id"), args.listId))
      .first();

    if (existingList) {
      await ctx.db.patch(existingList._id, {
        totalItems: args.itemAmount,
        totalAmount: args.totalPrice,
      });
    }

    console.log("List updated successfully");
  },
});

export const deleteList = mutation({
  args: { listId: v.string() },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("_id"), args.listId))
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
        .query("lists")
        .filter((q) => q.eq(q.field("_id"), listId))
        .first();

      if (existingList) {
        await ctx.db.delete(existingList._id);
      }
    }

    console.log("Lists deleted successfully");
  },
});

export const getListById = query({
  args: { listId: v.string() },

  handler: async (ctx, args) => {
    if (!args.listId) return null;

    const list = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("_id"), args.listId))
      .first();

    if (!list) return null;

    return list;
  },
});
