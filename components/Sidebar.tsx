"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Home,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export function AppSidebar({ name, email }: { name?: string; email?: string }) {
  const pathname = usePathname();

  if (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/") {
    return null;
  }

  const routes = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/application/dashboard",
          icon: Home,
        },
        {
          title: "Grocery List",
          href: "/application/shopping-lists",
          icon: ShoppingCart,
        },
        {
          title: "Expenses",
          href: "/application/expenses",
          icon: Receipt,
        },
      ],
    },
    {
      title: "Family",
      items: [
        {
          title: "Members",
          href: "/application/members",
          icon: Users,
        },
        {
          title: "Payments",
          href: "/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Preferences",
          href: "/preferences",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-3 font-semibold"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Grocy Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((section) => (
          <div key={section.title} className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </h2>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
