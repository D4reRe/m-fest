import {
  IconConfetti,
  IconDashboard,
  IconFileText,
  IconHelp,
  IconInvoice,
  IconListDetails,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

export const validExtensions = ["png", "jpeg", "jpg", "webp"];
export const maxFileSize = 4 * 1024 * 1024; // 4 MB
export const MIN_DIMENSION = 150;
export const competitionsName = ["BCC", "IPPC", "PDC", "STEM"];
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
    title: "Team",
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
      title: "Team",
      url: "/dashboard/team",
      icon: IconUsers,
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

export const EventsName = [
  "m-care",
  "m-run",
  "engine-tune-up",
  "m-talks",
  "m-expo",
  "ceremony",
];
