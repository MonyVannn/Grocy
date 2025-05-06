import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id")
      .filter((q) => q.eq(q.field("clerkUserId"), args.userId))
      .first();

    if (!user) return null;

    return user;
  },
});

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.userId))
      .unique();

    if (!existingUser) {
      const newUserId = await ctx.db.insert("users", {
        clerkUserId: args.userId,
        email: args.email,
        name: args.name,
        role: "admin",
      });

      await ctx.db.insert("members", {
        userId: newUserId,
        memberEmail: args.email,
        memberName: args.name,
        isActive: true,
        role: "admin",
      });
    }
  },
});
