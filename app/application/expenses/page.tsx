import React from "react";
import ExpenseListComponent from "./_components/ExpenseListComponent";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

async function ExpenseListPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const convexGroceryList = await convex.query(api.groceryLists.getLists, {
    userId: user?.id || "",
  });

  const convexExpenseLists = await convex.query(
    api.expenseLists.getExpenseLists,
    {
      userId: user?.id || "",
    }
  );

  const convexMembers = await convex.query(api.members.getMembersByUserId, {
    userId: user?.id || "",
  });

  return (
    <>
      {convexGroceryList && convexExpenseLists && convexMembers && (
        <ExpenseListComponent
          lists={convexExpenseLists}
          groceryLists={convexGroceryList}
          members={convexMembers}
        />
      )}
    </>
  );
}

export default ExpenseListPage;
