import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMembersByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (!members) return null;

    return members;
  },
});
