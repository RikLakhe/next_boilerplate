"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { APP_MENU } from "@/constants/menuConfig"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={APP_MENU.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={APP_MENU.navMain} />
        <NavProjects projects={APP_MENU.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={APP_MENU.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
