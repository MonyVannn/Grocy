import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

async function MainPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  const convexTripsSummary = await convex.query(api.groceryLists.getSummaries, {
    userId: convexUser?._id || "",
  });

  const convexMembersSummary = await convex.query(
    api.members.getMembersSummary,
    {
      userId: convexUser?._id || "",
    }
  );

  console.log("convexSummaries: ", convexMembersSummary);

  return (
    <>
      {/* <DashboardWrapper /> */}
      <Dashboard
        convexTripsSummary={convexTripsSummary}
        convexMembersSummary={convexMembersSummary}
      />
    </>
  );
}

export default MainPage;
