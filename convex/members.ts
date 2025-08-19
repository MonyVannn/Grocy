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

export const getMembersSummary = query({
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

    const currentMembers = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const previousMembers = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.gte(q.field("_creationTime"), startOfPrevMonth))
      .filter((q) => q.lt(q.field("_creationTime"), startOfCurrentMonth))
      .collect();

    const differences = currentMembers.length - previousMembers.length;
    const percentage =
      previousMembers.length > 0
        ? ((currentMembers.length - previousMembers.length) /
            previousMembers.length) *
          100
        : 100; // If there were no previous trips, consider it a 100% increase

    return {
      current: currentMembers.length,
      previous: previousMembers.length,
      differences,
      percentage,
    };
  },
});
