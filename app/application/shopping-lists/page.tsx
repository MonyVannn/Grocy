import React from "react";
import GroceryLists from "./_components/GroceryListComponent";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { GroceryList } from "@/app/types";

async function ShoppingList() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  const convexMembers = await convex.query(api.members.getMembersByUserId, {
    userId: convexUser?._id || "",
  });

  const convexLists = (await convex.query(api.groceryLists.getLists, {
    userId: convexUser?._id || "",
  })) as unknown as GroceryList[];

  return (
    <>
      {convexUser && convexMembers && convexLists && (
        <GroceryLists
          user={convexUser}
          members={convexMembers}
          lists={convexLists}
        />
      )}
    </>
  );
}

export default ShoppingList;
