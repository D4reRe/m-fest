import {
  IconConfetti,
  IconDashboard,
  IconDatabase,
  IconFileAnalytics,
  IconFileText,
  IconHelp,
  IconInvoice,
  IconListDetails,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Key } from "lucide-react";

export const validExtensions = ["png", "jpeg", "jpg", "webp"];
export const validSubmissionExtensions = ["pdf", "zip"];
export const maxFileSize = 4 * 1024 * 1024; // 4 MB
export const MAX_PROFILEIMAGE_SIZE = 512; // px
export const MIN_DIMENSION = 150;
export const competitionsName = ["BCC", "IPPC", "PDC", "STEM"];
export const adminRoles = ["ADMIN", "SUPERADMIN"];
export const userRoles = ["USER", "ADMIN", "SUPERADMIN"];
export const quizTypes = ["MATHEMATICS", "PHYSICS", "ESSAY"];
export const acceptedFiles = [".png", ".jpeg", ".jpg", ".webp"];
export const submissionOpenDate = "Ferbuary 1st 2026";
export const submissionDeadlinePDC = "March 6th 2026";
export const submissionDeadlineBCC = "March 7th 2026";
export const submissionDeadlineIPPC = "March 8th 2026";
export const links = [
  {
    title: "Events",
    href: "/events",
  },
  {
    title: "Competitions",
    href: "/competitions",
  },
  {
    title: "Timeline",
    href: "/#timeline",
  },
  {
    title: "FAQ",
    href: "/#faqs",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
];

export const menuItems = [
  { name: "Events", href: "/events" },
  { name: "Competitions", href: "/competitions" },
  { name: "Timeline", href: "/#timeline" },
  {
    name: "FAQ",
    href: "/#faqs",
  },
  {
    name: "Contact",
    href: "/#contact",
  },
];

export const menus = [
  {
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
  },
  {
    title: "Events",
    url: "/dashboard/events",
  },
  {
    title: "Competitions",
    url: "/dashboard/competitions",
  },
  {
    title: "Team & Register",
    url: "/dashboard/team",
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
  },
];

export const dataNavSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: IconUser,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: IconConfetti,
    },
    {
      title: "Competitions",
      url: "/dashboard/competitions",
      icon: IconListDetails,
    },
    {
      title: "Team & Register",
      url: "/dashboard/team",
      icon: IconUsersGroup,
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: IconInvoice,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "",
      icon: IconHelp,
    },
  ],
  navDocuments: [
    {
      name: "Documents",
      url: "/dashboard/documents",
      icon: IconFileText,
    },
  ],
};
export const dataNavSidebarAdmin = {
  navMain: [
    {
      title: "Back to Home Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: Key,
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: IconFileText,
    },
    {
      title: "User",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Teams",
      url: "/admin/teams",
      icon: IconUsersGroup,
    },
    {
      title: "Competitions",
      url: "/admin/competitions",
      icon: IconListDetails,
    },
    {
      title: "Exam Submission",
      url: "/admin/exam",
      icon: IconFileAnalytics,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: IconConfetti,
    },
    {
      title: "Payments & Invoices",
      url: "/admin/payments",
      icon: IconInvoice,
    },
    {
      title: "Database",
      url: "/admin/database",
      icon: IconDatabase,
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Get Help",
  //     url: "",
  //     icon: IconHelp,
  //   },
  // ],
  // navDocuments: [
  //   {
  //     name: "Documents",
  //     url: "/dashboard/documents",
  //     icon: IconFileText,
  //   },
  // ],
};

export const adminMenus = [
  {
    title: "Home Dashboard",
    url: "/dashboard",
  },
  {
    title: "Admin Dashboard",
    url: "/admin",
  },
  {
    title: "Documents",
    url: "/admin/documents",
  },
  {
    title: "User",
    url: "/admin/users",
  },
  {
    title: "Teams",
    url: "/admin/teams",
  },
  {
    title: "Competitions",
    url: "/admin/competitions",
  },
  {
    title: "Exam Submission",
    url: "/admin/exam",
  },
  {
    title: "Events",
    url: "/admin/events",
  },
  {
    title: "Payments & Invoices",
    url: "/admin/payments",
  },
  {
    title: "Database",
    url: "/admin/database",
  },
];

export const EventsName = [
  "m-care",
  "m-run",
  "engine-tune-up",
  "m-talks",
  "m-expo",
  "ceremony",
];
