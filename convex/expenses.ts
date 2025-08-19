import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const addExpense = mutation({
  args: {
    listId: v.id("lists"),
    userId: v.id("users"),
    memberId: v.id("members"),
    itemId: v.id("items"),
    shareAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const expense = await ctx.db.insert("itemSplits", {
      listId: args.listId,
      userId: args.userId,
      memberId: args.memberId,
      itemId: args.itemId,
      shareAmount: args.shareAmount,
      isPaid: false,
    });

    return expense;
  },
});

export const getExpenseByListId = query({
  args: {
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const expense = await ctx.db
      .query("itemSplits")
      .withIndex("by_list_id")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .collect();

    return expense;
  },
});

export const getExpensDetail = query({
  args: {
    listId: v.string(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("items")
      .withIndex("by_list_id")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .collect();

    const splits = await ctx.db
      .query("itemSplits")
      .withIndex("by_list_id")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .collect();

    // 1. Get unique member IDs from splits
    const memberIds = [...new Set(splits.map((s) => s.memberId))];

    // 2. Fetch all related members in a single query
    const members = await Promise.all(memberIds.map((id) => ctx.db.get(id)));

    const memberMap = new Map(
      members
        .filter((m): m is Doc<"members"> => m !== null)
        .map((m) => [m._id, m.memberName])
    );

    // 3. Group splits by itemId
    const splitsByItemId = new Map<string, typeof splits>();

    for (const split of splits) {
      if (!splitsByItemId.has(split.itemId)) {
        splitsByItemId.set(split.itemId, []);
      }
      splitsByItemId.get(split.itemId)!.push(split);
    }

    // 4. Construct the grouped structure
    const groupedByItem = items.map((item) => {
      const splitsForItem = splitsByItemId.get(item._id) || [];

      const formattedSplits = splitsForItem.map((split) => ({
        memberId: split.memberId,
        memberName: memberMap.get(split.memberId) || "Unknown",
        shareAmount: split.shareAmount,
        isPaid: split.isPaid ?? false,
        note: split.note ?? "",
      }));

      return {
        _id: item._id,
        itemName: item.itemName,
        splits: formattedSplits,
      };
    });

    return groupedByItem;
  },
});

export const updateExpense = mutation({
  args: {
    splitId: v.string(),
    itemId: v.id("items"),
    memberId: v.id("members"),
    shareAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const existingSplit = await ctx.db
      .query("itemSplits")
      .filter((q) => q.eq(q.field("_id"), args.splitId))
      .first();

    if (existingSplit) {
      await ctx.db.patch(existingSplit._id, {
        itemId: args.itemId,
        memberId: args.memberId,
        shareAmount: args.shareAmount,
      });
    }
  },
});

export const deleteExpensesByItemId = mutation({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const splits = await ctx.db
      .query("itemSplits")
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .collect();

    if (splits) {
      for (const split of splits) {
        await ctx.db.delete(split._id);
      }
    }
  },
});

export const markPaid = mutation({
  args: {
    listId: v.string(),
    memberId: v.string(),
    isPaid: v.boolean(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingSplit = await ctx.db
      .query("itemSplits")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .filter((q) => q.eq(q.field("memberId"), args.memberId))
      .collect();

    if (existingSplit.length > 0) {
      for (const split of existingSplit) {
        await ctx.db.patch(split._id, {
          isPaid: args.isPaid,
          note: args.note,
        });
      }
    }

    return existingSplit;
  },
});

export const getCalendarCardData = query({
  args: { userId: v.string() },
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
    ).getTime();

    // get total trips current month
    const currentExpense = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.gte(q.field("_creationTime"), startOfMonth))
      .filter((q) => q.lt(q.field("_creationTime"), startOfNextMonth))
      .collect();

    const totalAmountCurrent = currentExpense.reduce(
      (sum, expense) => sum + (expense.totalAmount || 0),
      0
    );

    // get total trips last month
    const previousExpense = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.gte(q.field("_creationTime"), startOfPrevMonth))
      .filter((q) => q.lt(q.field("_creationTime"), startOfCurrentMonth))
      .collect();

    const totalAmountPrevious = previousExpense.reduce(
      (sum, expense) => sum + (expense.totalAmount || 0),
      0
    );

    const differences = totalAmountCurrent - totalAmountPrevious;
    const percentage =
      totalAmountPrevious > 0
        ? ((totalAmountCurrent - totalAmountPrevious) / totalAmountPrevious) *
          100
        : 100; // If there were no previous trips, consider it a 100% increase

    const tripDay = currentExpense.map(
      (expense) => new Date(expense.listDate).getDate() - 1
    );

    return {
      tripDay,
      current: totalAmountCurrent,
      previous: totalAmountPrevious,
      differences,
      percentage,
    };
  },
});
