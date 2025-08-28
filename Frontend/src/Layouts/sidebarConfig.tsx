import {
  Dashboard,
  People,
  Home,
  Assignment,
  Description,
  Mail,
  BookOnline,
  AccountCircle,
  Apartment,
  AttachMoney,
} from "@mui/icons-material";

export const sidebarLinks = {
  admin: [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
    { text: "Users", icon: <People />, path: "/admin/users" },
    { text: "Properties", icon: <Home />, path: "/admin/properties" },
    { text: "Verify Property", icon: <Home />, path: "/admin/verifyproperties" },
    {text: "Tenant Verification",icon: <Assignment />,path: "/admin/tenant-verification",},
    { text: "Agreements", icon: <Description />, path: "/admin/agreements" },
  ],
  owner: [
    { text: "Dashboard", icon: <Dashboard />, path: "/owner-dashboard" },
    { text: "My Properties", icon: <Home />, path: "/owner/properties" },
    { text: "Enquiries", icon: <Mail />, path: "/owner/enquiries" },
    { text: "Bookings", icon: <BookOnline />, path: "/owner/bookings" },
    { text: "Agreements", icon: <Description />, path: "/owner/agreements" },
  ],
  tenant: [
    { text: "Dashboard", icon: <Dashboard />, path: "/tenant-dashboard" },
    { text: "My Profile", icon: <AccountCircle />, path: "/tenantprofile" },
    { text: "My Enquiries", icon: <Mail />, path: "/enquiries" },
    { text: "My Bookings", icon: <BookOnline />, path: "/bookings" },
    { text: "My Agreements", icon: <BookOnline />, path: "/tenantAgreements" },
  ],
  agent: [
    { text: "Properties", icon: <Apartment />, path: "/agent/properties" },
    { text: "Commissions", icon: <AttachMoney />, path: "/agent/commissions" },
  ],
};
