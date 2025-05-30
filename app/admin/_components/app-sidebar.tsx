'use client'

import { GraduationCap, BriefcaseBusiness, ShieldCheck, FolderDot, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Manage Projects",
    url: "/admin/projects",
    icon: FolderDot,
  },
  {
    title: "Manage Work Experiences",
    url: "/admin/work-experiences",
    icon: BriefcaseBusiness,
  },
  {
    title: "Manage Certificates",
    url: "/admin/certificates",
    icon: ShieldCheck,
  },
  {
    title: "Manage Educations",
    url: "/admin/educations",
    icon: GraduationCap,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hover:underline hover:cursor-pointer">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                signOut();
              }}
              className="text-md flex items-center gap-2 hover:cursor-pointer">
              <LogOutIcon />
              Logout
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex justify-center scrollbar-hide gap-8 py-20">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
