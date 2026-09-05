import React from "react";

// Minimal line icons, no external dependency. Each takes className for sizing/color via CSS.
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export const IconDashboard = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

export const IconTransactions = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h13l-3-3M20 17H7l3 3" />
  </svg>
);

export const IconInvoice = (props) => (
  <svg {...base} {...props}>
    <path d="M6 2.5h9l3 3V21a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 21V3a.5.5 0 0 1 .5-.5Z" />
    <path d="M9 8h6M9 12h6M9 16h3.5" />
  </svg>
);

export const IconCalculator = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="2.5" width="16" height="19" rx="2" />
    <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v4M8 19h.01M12 19h.01" />
  </svg>
);

export const IconPercent = (props) => (
  <svg {...base} {...props}>
    <path d="M5 19 19 5" />
    <circle cx="7" cy="7" r="2.3" />
    <circle cx="17" cy="17" r="2.3" />
  </svg>
);

export const IconAdvisor = (props) => (
  <svg {...base} {...props}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" />
    <path d="M8.5 8.5h7M8.5 11h4.5" />
  </svg>
);

export const IconBuilding = (props) => (
  <svg {...base} {...props}>
    <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21" />
    <path d="M14 10.5h4.5A1.5 1.5 0 0 1 20 12v9" />
    <path d="M4 21h16M7.5 8h1M7.5 12h1M7.5 16h1M17 14h1M17 17h1" />
  </svg>
);

export const IconHelp = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.3 9.2a2.7 2.7 0 1 1 4 2.35c-.8.46-1.3.9-1.3 1.95" />
    <path d="M12 17.2h.01" />
  </svg>
);

export const IconTheme = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={18} height={18} style={{ flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {dark ? (
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
    ) : (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6m10-9.78L15.54 4.22" />
      </>
    )}
  </svg>
);

export const IconBell = (props) => (
  <svg {...base} {...props} viewBox="0 0 24 24" width={18} height={18} style={{ flexShrink: 0 }}>
    <path d="M12 22a2 2 0 0 0 2-2H9a2 2 0 0 0 2 2Z" />
    <path d="M18 8A6 6 0 0 0 6 8c0 4.97-3 5.93-3 5.93h18S21 12.97 21 8Z" />
  </svg>
);

export const IconReport = (props) => (
  <svg {...base} {...props} viewBox="0 0 24 24">
    <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
    <path d="M8 9h8M8 13h4" />
  </svg>
);

export const NAV_ICONS = {
  dashboard: IconDashboard,
  transactions: IconTransactions,
  invoices: IconInvoice,
  tax: IconCalculator,
  gst: IconPercent,
  advisor: IconAdvisor,
  settings: IconBuilding,
  reports: IconReport,
};
