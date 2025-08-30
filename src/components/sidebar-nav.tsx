import React from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  PieChart,
  Receipt,
  TrendingUp,
  Target,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavItem {
  name: string;
  href: string;
icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
  { name: "Portfolio", href: "/portfolio", icon: <PieChart className="h-5 w-5" /> },
  { name: "Trades", href: "/trade-history", icon: <Receipt className="h-5 w-5" /> },
  { name: "Analytics", href: "/analytics", icon: <TrendingUp className="h-5 w-5" /> },
  { name: "Goals", href: "/goals", icon: <Target className="h-5 w-5" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
];

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-background border-r">
        <div className="flex items-center justify-center px-4">
          <h1 className="text-xl font-bold">Investment Tracker</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
          <div className="p-2 border-t">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};