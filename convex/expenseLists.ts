import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getExpenseLists = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const expenseLists = await ctx.db
      .query("expenseLists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return expenseLists;
  },
});

export const getExpenseListById = query({
  args: { expenseListId: v.string() },
  handler: async (ctx, args) => {
    const expenseList = await ctx.db
      .query("expenseLists")
      .filter((q) => q.eq(q.field("expenseListId"), args.expenseListId))
      .first();

    return expenseList;
  },
});

export const addExpenseList = mutation({
  args: {
    expenseListId: v.string(),
    listId: v.string(),
    userId: v.string(),
    payerId: v.string(),
    listDate: v.number(),
    note: v.string(),
    itemsAmount: v.number(),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("expenseLists")
      .filter((q) => q.eq(q.field("expenseListId"), args.expenseListId))
      .first();

    if (!existingList) {
      await ctx.db.insert("expenseLists", {
        expenseListId: args.expenseListId,
        listId: args.listId,
        userId: args.userId,
        listDate: args.listDate,
        note: args.note,
        payerId: args.payerId,
        itemsAmount: args.itemsAmount,
        totalPrice: args.totalPrice,
        isPaid: false,
        createdAt: Date.now(),
      });
    }

    console.log("List added successfully");
  },
});

export const deleteExpenseList = mutation({
  args: { expenseListId: v.string() },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("expenseLists")
      .filter((q) => q.eq(q.field("expenseListId"), args.expenseListId))
      .first();

    if (existingList) {
      await ctx.db.delete(existingList._id);
    }

    console.log("List deleted successfully");
  },
});
