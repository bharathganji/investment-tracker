import React, { memo } from "react";
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
import { useAuth } from "@/contexts/auth-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: <PieChart className="h-5 w-5" />,
  },
  {
    name: "Trades",
    href: "/trade-history",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  { name: "Goals", href: "/goals", icon: <Target className="h-5 w-5" /> },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

// Memoized NavItem component to prevent unnecessary re-renders
const NavItemComponent = memo(
  ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <Link key={item.href} href={item.href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isActive
            ? "bg-muted text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-primary",
        )}
      >
        {item.icon}
        <span className="ml-3">{item.name}</span>
      </Button>
    </Link>
  ),
);

NavItemComponent.displayName = "NavItemComponent";

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // Don't render anything while auth state is loading
  if (isLoading) {
    return null;
  }

  // All navigation items are available to all authenticated users
  const allNavItems = navItems;

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex flex-grow flex-col border-r bg-background pt-5">
        <div className="flex items-center justify-center px-4">
          <h1 className="text-xl font-bold">Investment Tracker</h1>
        </div>
        <div className="mt-5 flex flex-1 flex-col">
          <nav className="flex-1 space-y-1 px-2">
            {allNavItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
          <div className="border-t p-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};
