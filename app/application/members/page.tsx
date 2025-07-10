import React from "react";
import MemberComponent from "./_components/memberComponent";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

async function MemberPage() {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  const convexMember = await convex.query(api.members.getMembersByUserId, {
    userId: convexUser?._id || "",
  });

  return (
    <>
      {convexUser && convexMember && (
        <MemberComponent user={convexUser} convexMembers={convexMember} />
      )}
    </>
  );
}

export default MemberPage;
