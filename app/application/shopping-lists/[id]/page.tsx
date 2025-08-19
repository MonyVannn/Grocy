import React from "react";
import GroceryListDetail from "../_components/GroceryListDetailComponent";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { GroceryList } from "@/app/types";

async function GroceryListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { id } = await params;

  const convexGroceryList = (await convex.query(api.groceryLists.getListById, {
    listId: id,
  })) as unknown as GroceryList;

  if (!convexGroceryList) {
    redirect("/application/shopping-lists");
  }

  const convexMembers = await convex.query(api.members.getMembersByUserId, {
    userId: convexGroceryList.userId,
  });

  const convexGroceries = await convex.query(api.groceries.getGroceries, {
    listId: id,
  });

  const convexSplits = await convex.query(api.expenses.getExpensDetail, {
    listId: id,
  });

  return (
    <>
      {convexGroceries &&
        convexGroceryList &&
        convexMembers &&
        convexSplits && (
          <GroceryListDetail
            groceries={convexGroceries}
            list={convexGroceryList}
            members={convexMembers}
            splits={convexSplits}
          />
        )}
    </>
  );
}

export default GroceryListDetailPage;
