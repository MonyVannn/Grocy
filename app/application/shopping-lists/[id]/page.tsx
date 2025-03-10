import React from "react";
import GroceryListDetail from "../_components/GroceryListDetailComponent";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

async function GroceryListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { id } = await params;

  const convexGroceryList = await convex.query(api.groceryLists.getListById, {
    listId: id,
  });

  if (!convexGroceryList) {
    redirect("/application/shopping-lists");
  }

  const convexMembers = await convex.query(api.members.getMembersByUserId, {
    userId: convexGroceryList.userId,
  });

  const convexGroceries = await convex.query(api.groceries.getGroceries, {
    listId: id,
  });

  return (
    <>
      {convexGroceries && convexGroceryList && convexMembers && (
        <GroceryListDetail
          groceries={convexGroceries}
          list={convexGroceryList}
          members={convexMembers}
        />
      )}
    </>
  );
}

export default GroceryListDetailPage;
