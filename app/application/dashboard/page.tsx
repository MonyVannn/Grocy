import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

async function MainPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      {/* <DashboardWrapper /> */}
      dashboard
    </>
  );
}

export default MainPage;
