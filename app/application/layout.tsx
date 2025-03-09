import type React from "react";
import { Inter } from "next/font/google";

import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/convex/users";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const user = await currentUser();

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  if (!user) {
    redirect("/sign-in");
  }

  if (user.id !== convexUser?.userId || !convexUser) {
    await convex.mutation(api.users.syncUser, {
      userId: user?.id || "",
      email: user?.emailAddresses[0].emailAddress || "",
      name: user?.fullName || "",
    });
  }
  return (
    <>
      <SidebarProvider>
        <div className="flex w-full min-h-screen bg-background">
          <AppSidebar
            name={user?.fullName || "User"}
            email={user?.emailAddresses[0].emailAddress || ""}
          />
          <div className="flex-1 w-full">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 w-full">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold">Grocy Dashboard</h1>
            </header>
            <main className="w-full p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
