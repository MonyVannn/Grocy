import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";

async function MainPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <Dashboard />
    </>
  );
}

export default MainPage;
