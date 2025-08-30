import React from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  PieChart,
  Receipt,
  TrendingUp,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
];

export const MobileNav: React.FC = () => {
 const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="grid grid-cols-5">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full rounded-none py-3",
                pathname === item.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              )}
            >
              {item.icon}
              <span className="sr-only">{item.name}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};