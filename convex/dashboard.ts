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
    startOfPreviousMonthTimestamp: v.number(),
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

    // fetch last month lists
    const grocerySpendingPreviousMonth = await ctx.db
      .query("groceryLists")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", args.userId)
          .gte("date", args.startOfPreviousMonthTimestamp)
          .lt("date", args.startOfMonthTimestamp - 1),
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

    // fetch last month expense lists
    const expenseSpendingPreviousMonth = await ctx.db
      .query("expenseLists")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", args.userId)
          .gte("listDate", args.startOfPreviousMonthTimestamp)
          .lt("listDate", args.startOfMonthTimestamp - 1),
      )
      .collect();

    // aggregate spending per member
    const memberSpendingMap = new Map<string, number>();
    let totalOverallSpending = 0;
    let totalOverallSpendingPreviousMonth = 0;

    grocerySpending.forEach((list) => {
      const currentSpending = memberSpendingMap.get(list.shopperId) || 0;
      memberSpendingMap.set(list.shopperId, currentSpending + list.totalPrice);
      totalOverallSpending += list.totalPrice;
    });

    grocerySpendingPreviousMonth.forEach((list) => {
      const previousSpending = memberSpendingMap.get(list.shopperId) || 0;
      memberSpendingMap.set(list.shopperId, previousSpending + list.totalPrice);
      // totalOverallSpendingPreviousMonth += list.totalPrice;
    });

    expenseSpending.forEach((list) => {
      const currentSpending = memberSpendingMap.get(list.payerId) || 0;
      // memberSpendingMap.set(list.payerId, currentSpending + list.totalPrice);
      // totalOverallSpending += list.totalPrice;
    });

    expenseSpendingPreviousMonth.forEach((list) => {
      const previousSpending = memberSpendingMap.get(list.payerId) || 0;
      memberSpendingMap.set(list.payerId, previousSpending + list.totalPrice);
      totalOverallSpendingPreviousMonth += list.totalPrice;
    });

    const totalOverallSpendingDifference =
      totalOverallSpendingPreviousMonth - totalOverallSpending;
    const percentageDifference =
      totalOverallSpendingPreviousMonth === 0
        ? totalOverallSpending === 0 // Check if current spending is also 0
          ? 0 // If both are 0, percentage difference is 0
          : 1 // If previous was 0 but current is not, represent as 1 (100%)
        : // Otherwise (previous month spending is not 0), calculate normally:
        (totalOverallSpendingPreviousMonth - totalOverallSpending) /
        totalOverallSpendingPreviousMonth;

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
      averageSpending: Math.abs(avgSpendingPerMember).toFixed(2),
      totalOverallSpending: Math.abs(totalOverallSpending).toFixed(2),
      totalOverallSpendingPreviousMonth,
      totalOverallSpendingDifference,
      percentageDifference,
    };
  },
});
