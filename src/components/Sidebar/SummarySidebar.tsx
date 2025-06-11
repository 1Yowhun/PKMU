"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function SummarySidebar({
  items,
  activeItem,
  onClick,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  activeItem: string | null;
  onClick: (url: string) => void;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              className={[
                activeItem === item.url ? "bg-gray-100" : "hover:bg-gray-100",
                "my-1",
              ].join(" ")}
              asChild
              onClick={(e) => {
                // e.preventDefault();
                onClick(item.url);
              }}
            >
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
