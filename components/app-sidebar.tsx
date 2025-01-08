"use client"

import { UserButton, useUser } from "@clerk/nextjs";
import { Mic, History, Settings, Crown, Menu, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const menuItems = [
    {
      href: "/",
      label: "Back to Home",
      icon: Home,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Menu,
    },
    {
      href: "/dashboard/history",
      label: "History",
      icon: History,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/pricing",
      label: "Upgrade Plan",
      icon: Crown,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6" />
          <span className="font-semibold">VoiceForge</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Menu</h2>
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  // Special styling for "Back to Home"
                  item.href === "/" && "text-primary hover:text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userPreviewMainIdentifier: "text-foreground",
                  userPreviewSecondaryIdentifier: "text-muted-foreground",
                },
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {user.fullName || user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
