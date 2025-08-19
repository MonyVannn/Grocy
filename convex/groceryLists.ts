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

export const getSummaries = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based index (0 = January)

    // Calculate current month
    const startOfMonth = new Date(currentYear, currentMonth, 1).getTime(); // inclusive
    const startOfNextMonth = new Date(
      currentYear,
      currentMonth + 1,
      1
    ).getTime(); // exclusive

    // Calculate previous month
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth(); // still 0-based

    const startOfPrevMonth = new Date(prevYear, prevMonth, 1).getTime(); // inclusive
    const startOfCurrentMonth = new Date(
      currentYear,
      currentMonth,
      1
    ).getTime(); // exclusive

    // get total trips current month
    const currentTrips = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.gte(q.field("_creationTime"), startOfMonth))
      .filter((q) => q.lt(q.field("_creationTime"), startOfNextMonth))
      .collect();

    // get total trips last month
    const previousTrips = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.gte(q.field("_creationTime"), startOfPrevMonth))
      .filter((q) => q.lt(q.field("_creationTime"), startOfCurrentMonth))
      .collect();

    // get total unsettled & settled trips
    const unsettled = currentTrips.filter((trip) => trip.isSettled === false);
    const settled = currentTrips.filter((trip) => trip.isSettled === true);

    const totalUnsettled = unsettled.length;
    const totalSettled = settled.length;

    // calculate differences & percentage
    const differences = currentTrips.length - previousTrips.length;
    const percentage =
      previousTrips.length > 0
        ? ((currentTrips.length - previousTrips.length) /
            previousTrips.length) *
          100
        : 100; // If there were no previous trips, consider it a 100% increase

    return {
      currentTrips: currentTrips.length,
      previousTrips: previousTrips.length,
      totalUnsettled,
      totalSettled,
      percentage,
      differences,
    };
  },
});
