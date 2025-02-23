import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, PieChartIcon, Settings2, SquareTerminal } from "lucide-react"

const APP_MENU = {
  user: {
    name: "Rikesh",
    email: "rikesh@F.net",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Employee Management",
      url: "/employee",
      icon: SquareTerminal,
      items: [
        {
          title: "Attendance",
          url: "/employee/attendance",
        },
        {
          title: "Profiles",
          url: "/employee/profiles",
        },
        {
          title: "Departments",
          url: "/employee/departments",
        },
      ],
    },
    {
      title: "Payroll & Benefits",
      url: "/payroll",
      icon: Bot,
      items: [
        {
          title: "Salary",
          url: "/payroll/salary",
        },
        {
          title: "Bonus",
          url: "/payroll/bonus",
        },
      ],
    },
    {
      title: "Performance & KPI",
      url: "/performance",
      icon: BookOpen,
      items: [
        {
          title: "Reviews",
          url: "/performance/reviews",
        },
        {
          title: "Gaols",
          url: "/performance/goals",
        },
        {
          title: "Feedback",
          url: "/performance/feedback",
        },
      ],
    },
    {
      title: "Time & Leave Management",
      url: "/time",
      icon: Settings2,
      items: [
        {
          title: "Leave Request",
          url: "/time/leave-request",
        },
        {
          title: "Holiday",
          url: "/time/holiday",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Approvals",
      url: "/approvals",
      icon: Frame,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: PieChartIcon,
    },
    {
      name: "Performance Reviews",
      url: "/reviews",
      icon: Map,
    },
    {
      name: "Profile",
      url: "/profile",
      icon: Map,
    },
    {
      name: "Leave Requests",
      url: "/leave-requests",
      icon: Map,
    },
    {
      name: "Payslip",
      url: "/payslip",
      icon: Map,
    },
    {
      name: "Hiring",
      url: "/hiring",
      icon: Map,
    },
    {
      name: "Policies",
      url: "/policies",
      icon: Map,
    },
    {
      name: "Compliance",
      url: "/compliance",
      icon: Map,
    },
    {
      name: "Events and Notices",
      url: "/event-notice",
      icon: Map,
    },
  ],
}

export { APP_MENU }