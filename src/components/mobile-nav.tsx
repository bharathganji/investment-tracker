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
import { useAuth } from "@/contexts/auth-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Memoized MobileNavItem component to prevent unnecessary re-renders
const MobileNavItem = memo(
  ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <Link key={item.href} href={item.href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "flex h-16 w-full flex-col items-center justify-center rounded-none py-2 text-[10px]",
          isActive
            ? "bg-muted text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-primary",
        )}
      >
        <div className="flex items-center justify-center">{item.icon}</div>
        <span className="mt-1 px-1 text-center text-[10px] leading-tight">
          {item.name}
        </span>
      </Button>
    </Link>
  ),
);

MobileNavItem.displayName = "MobileNavItem";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // Don't render anything while auth state is loading
  if (isLoading) {
    return null;
  }

  // Base navigation items
  const baseNavItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
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

  const allNavItems = baseNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="grid w-full grid-cols-6">
        {allNavItems.map((item) => (
          <MobileNavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </div>
  );
};
