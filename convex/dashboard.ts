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
