import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMember = mutation({
  args: {
    memberId: v.string(),
    userId: v.string(),
    memberName: v.string(),
    memberEmail: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const existingMember = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("memberName"), args.memberName))
      .first();

    if (!existingMember) {
      await ctx.db.insert("members", {
        memberId: args.memberId,
        userId: args.userId,
        memberName: args.memberName,
        memberEmail: args.memberEmail,
        role: args.role,
        createdAt: Date.now(),
      });
    }

    console.log("Member added successfully");
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
      .filter((q) => q.eq(q.field("memberId"), args.memberId))
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
      .filter((q) => q.eq(q.field("memberId"), args.memberId))
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

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (!members) return null;

    return members;
  },
});
