import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getExpenses = query({
  args: { expenseId: v.string() },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("expenseId"), args.expenseId))
      .first();

    return expenses;
  },
});

export const addExpenses = mutation({
  args: {
    expenseId: v.string(),
    listId: v.string(),
    totalAmount: v.number(),
    totalTax: v.number(),
    items: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
        quantity: v.string(),
        price: v.number(),
        tax: v.number(),
        totalDue: v.number(),
        owners: v.array(
          v.object({
            memberId: v.string(),
            amount: v.number(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const expense = await ctx.db.insert("expenses", {
      expenseId: args.expenseId,
      listId: args.listId,
      totalAmount: args.totalAmount,
      totalTax: args.totalTax,
      items: args.items.map((item) => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        tax: item.tax,
        totalDue: item.totalDue,
        owners: item.owners,
      })),
      createdAt: Date.now(),
    });

    return expense;
  },
});
