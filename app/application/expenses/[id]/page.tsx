import React from "react";
import ExpenseDetailComponent from "../_components/ExpenseDetailComponent";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Expense, ExpenseList } from "@/app/types";

async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  const { id } = await params;

  if (!user) {
    redirect("/sign-in");
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const convexExpenseList = (await convex.query(
    api.expenseLists.getExpenseListById,
    {
      expenseListId: id,
    }
  )) as unknown as ExpenseList;

  const convexMembers = await convex.query(api.members.getMembersByUserId, {
    userId: user?.id || "",
  });

  const convexExpenses = (await convex.query(api.expenses.getExpenses, {
    expenseId: id,
  })) as unknown as Expense;
  return (
    <>
      {convexExpenses && convexMembers && convexExpenseList && (
        <ExpenseDetailComponent
          expenses={convexExpenses}
          members={convexMembers}
          expenseList={convexExpenseList}
        />
      )}
    </>
  );
}

export default ExpenseDetailPage;
