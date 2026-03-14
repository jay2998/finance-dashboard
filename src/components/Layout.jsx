import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/budgets", icon: PiggyBank, label: "Budgets" },
];

function NavLinks() {
  return (
    <nav className="flex flex-col gap-2 mt-8">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Layout() {
  const [dark, setDark] = useState(false);

  function toggleDark() {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: dark ? "#0f172a" : "#f8fafc",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          backgroundColor: dark ? "#1e293b" : "white",
          borderRight: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
          padding: "16px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{ color: dark ? "white" : "#0f172a" }}
            className="text-xl font-bold px-4 flex items-center gap-2"
          >
            <img src="/rupee.ico" alt="rupee" className="w-6 h-6" />
            FinanceApp
          </h1>{" "}
          <NavLinks />
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full justify-start px-4 text-slate-600 dark:text-slate-300"
          onClick={toggleDark}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? "Light mode" : "Dark mode"}
        </Button>
      </aside>

      {/* Main content */}
      <main
        style={{ backgroundColor: dark ? "#0f172a" : "#f8fafc" }}
        className="flex-1 p-6 md:p-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
