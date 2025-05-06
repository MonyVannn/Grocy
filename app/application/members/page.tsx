import React from "react";
import MemberComponent from "./_components/memberComponent";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

async function MemberPage() {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  const convexMembers = await convex.query(api.members.getMembersByUserId, {
    userId: convexUser?._id || "",
  });

  return (
    <>
      {convexUser && convexMembers && (
        <MemberComponent user={convexUser} convexMembers={convexMembers} />
      )}
    </>
  );
}

export default MemberPage;
