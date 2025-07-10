import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMember = mutation({
  args: {
    userId: v.id("users"),
    memberName: v.string(),
    memberEmail: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", args.userId))
      .unique();

    if (!user) return;

    const newMemberId = await ctx.db.insert("members", {
      userId: user._id,
      memberName: args.memberName,
      memberEmail: args.memberEmail,
      role: args.role,
      isActive: true,
    });

    const newMember = await ctx.db.get(newMemberId);

    if (!newMember) throw new Error("Failed to retrieve newly created user!");

    return newMember;
  },
});

export const editMember = mutation({
  args: {
    memberId: v.string(),
    memberName: v.string(),
    memberEmail: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const existingMember = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("_id"), args.memberId))
      .first();

    if (existingMember) {
      await ctx.db.patch(existingMember._id, {
        memberName: args.memberName,
        memberEmail: args.memberEmail,
        role: args.role,
      });
    }

    console.log("Member updated successfully");
  },
});

export const deleteMember = mutation({
  args: { memberId: v.string() },
  handler: async (ctx, args) => {
    const existingMember = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("_id"), args.memberId))
      .first();

    if (existingMember) {
      await ctx.db.delete(existingMember._id);
    }

    console.log("Member deleted successfully");
  },
});

export const getMembersByUserId = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;
    console.log("userId: ", args.userId);

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (!members) return null;

    return members;
  },
});
