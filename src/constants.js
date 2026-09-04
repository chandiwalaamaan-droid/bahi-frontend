export const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "invoices", label: "Invoices" },
  { id: "tax", label: "Tax Calculator" },
  { id: "gst", label: "GST Calculator" },
  { id: "advisor", label: "AI Advisor" },
  { id: "settings", label: "Business Profile" },
];

export const CATEGORIES = {
  income: ["Client payment", "Salary", "Freelance", "Interest", "Other income"],
  expense: ["Rent", "Software/tools", "Travel", "Supplies", "Utilities", "Salaries paid", "Marketing", "Taxes", "Other expense"],
};

export const EXPENSE_CATEGORIES = CATEGORIES.expense;
