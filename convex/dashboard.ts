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

type MemberSpending = {
  memberId: string;
  memberName: string;
  totalSpent: number;
};

export const getMonthlySpendingSummary = query({
  args: {
    userId: v.string(),
    startOfMonthTimestamp: v.number(),
    endOfMonthTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
    // fetch relevent grocery lists
    const grocerySpending = await ctx.db
      .query("groceryLists")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", args.userId)
          .gte("date", args.startOfMonthTimestamp)
          .lt("date", args.endOfMonthTimestamp),
      )
      .collect();

    // fetch relevent expense lists
    const expenseSpending = await ctx.db
      .query("expenseLists")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", args.userId)
          .gte("listDate", args.startOfMonthTimestamp)
          .lt("listDate", args.endOfMonthTimestamp),
      )
      .collect();

    // aggregate spending per member
    const memberSpendingMap = new Map<string, number>();
    let totalOverallSpending = 0;

    grocerySpending.forEach((list) => {
      const currentSpending = memberSpendingMap.get(list.shopperId) || 0;
      memberSpendingMap.set(list.shopperId, currentSpending + list.totalPrice);
      totalOverallSpending += list.totalPrice;
    });

    expenseSpending.forEach((list) => {
      const currentSpending = memberSpendingMap.get(list.payerId) || 0;
      memberSpendingMap.set(list.payerId, currentSpending + list.totalPrice);
      totalOverallSpending += list.totalPrice;
    });

    // fetch all members associated with the user
    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // calculate spending per member
    let topSpenderId: string | null = null;
    let maxSpending = 0;
    const allSpendingResult: MemberSpending[] = allMembers.map((member) => {
      const totalSpent = memberSpendingMap.get(member.memberId) || 0;

      if (totalSpent > maxSpending) {
        maxSpending = totalSpent;
        topSpenderId = member.memberId;
      }

      return {
        memberId: member.memberId,
        memberName: member.memberName,
        totalSpent: totalSpent,
      };
    });

    // determine the top spender details
    let topSpenderResult: MemberSpending | null = null;
    if (topSpenderId) {
      topSpenderResult =
        allSpendingResult.find((m) => m.memberId === topSpenderId) || null;
    }

    // calculate the avg spending
    const numberOfMembers = allMembers.length;
    const avgSpendingPerMember =
      numberOfMembers > 0 ? totalOverallSpending / numberOfMembers : 0;

    return {
      allSpending: allSpendingResult,
      topSpender: topSpenderResult,
      averageSpending: avgSpendingPerMember,
      totalOverallSpending: totalOverallSpending,
    };
  },
});
