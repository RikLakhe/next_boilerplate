import React from "react";
import {
  BankOutlined,
  DesktopOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

export const MENU_CONFIG = [
  {
    key: "users",
    label: "My Team",
    icon: React.createElement(UserOutlined),
    path: "/app/my-team",
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: React.createElement(DesktopOutlined),
    subMenu: [
      {
        key: "leaves",
        label: "Leaves",
        path: "/app/attendance/leaves",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "worklogs",
        label: "Worklogs",
        path: "/app/attendance/worklogs",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "report",
        label: "Report",
        path: "/app/attendance/report",
        icon: React.createElement(CaretRightOutlined),
      },
    ],
  },
  {
    key: "teams",
    label: "Teams",
    icon: React.createElement(TeamOutlined),
    subMenu: [
      {
        key: "projects",
        label: "Projects",
        path: "/app/teams/projects",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "allocations",
        label: "Allocations",
        path: "/app/teams/allocations",
        icon: React.createElement(CaretRightOutlined),
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: React.createElement(SettingOutlined),
    subMenu: [
      {
        key: "general",
        label: "General",
        path: "/app/settings/general",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "areas",
        label: "Areas",
        path: "/app/settings/areas",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "designation",
        label: "Designation",
        path: "/app/settings/designations",
        icon: React.createElement(CaretRightOutlined),
      },
    ],
  },
  {
    key: "divider-menu-item-1",
  },
  {
    key: "company",
    label: "Aricalot Inc.",
    icon: React.createElement(BankOutlined),
    subMenu: [
      {
        key: "home",
        label: "Home",
        path: "/app/company/home",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "org",
        label: "Org Chart",
        path: "/app/company/org",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "directory",
        label: "Directory",
        path: "/app/company/directory",
        icon: React.createElement(CaretRightOutlined),
      },
      {
        key: "department",
        label: "Department",
        path: "/app/company/department",
        icon: React.createElement(CaretRightOutlined),
      },
    ],
  },
];

export const ADMIN_MENU_CONFIG = [
  {
    key: "admin-organization",
    label: "Organization",
    subMenu: [
      {
        key: "admin-directory",
        label: "Directory",
        path: "/admin/organization/directory",
      },
      {
        key: "admin-area",
        label: "Area",
        path: "/admin/organization/area",
      },
      {
        key: "admin-designation",
        label: "Desination",
        path: "/admin/organization/designation",
      },
      {
        key: "admin-department",
        label: "Department",
        path: "/admin/organization/department",
      },
    ],
  },
  {
    key: "admin-calendar",
    label: "Calendar",
    subMenu: [
      {
        key: "admin-events",
        label: "Events",
        path: "/admin/calendar/events",
      },
      {
        key: "admin-holidays",
        label: "Holidays",
        path: "/admin/calendar/holidays",
      },
      {
        key: "admin-notices",
        label: "Notices",
        path: "/admin/calendar/notices",
      },
      {
        key: "admin-calendar-general",
        label: "General",
        path: "/admin/calendar",
      },
    ],
  },
  {
    key: "admin-company",
    label: "Company",
    subMenu: [
      {
        key: "admin-company-general",
        label: "General",
        path: "/admin/company",
      },
      {
        key: "admin-fiscal-year",
        label: "Fiscal Year",
        path: "/admin/company/fiscal",
      },
      {
        key: "admin-leave",
        label: "Leaves",
        path: "/admin/company/leave",
      },
    ],
  },
  {
    key: "admin-performance",
    label: "Performance",
    subMenu: [
      {
        key: "admin-reviews",
        label: "Reviews",
        path: "/admin/performance/reviews",
      },
      {
        key: "admin-questions",
        label: "Questions",
        path: "/admin/performance/questions",
      },
      {
        key: "admin-performance-general",
        label: "general",
        path: "/admin/performance/general",
      },
    ],
  },
  {
    key: "admin-settings",
    label: "Settings",
    path: "/admin/settings",
  },
  {
    key: "admin-database",
    label: "Database",
    path: "/admin/database",
  },
];

export const MASTER_DATA_MENU_CONFIG = [
  {
    key: "timezone",
    label: "Timezones",
  },
  {
    key: "calendar",
    label: "Calendar",
    subMenu: [
      {
        key: "event",
        label: "Events",
      },
      {
        key: "holiday",
        label: "Holidays",
      },
      {
        key: "notice",
        label: "Notices",
      },
      {
        key: "urgency",
        label: "Urgency",
      },
    ],
  },
  {
    key: "company",
    label: "Company",
    subMenu: [
      {
        key: "values_category",
        label: "Values Categories",
      },
    ],
  },
];
