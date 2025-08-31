"use client";

import React from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { MobileNav } from "@/components/mobile-nav";
import { GradientButton } from "@/components/ui/gradient-button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Don't show navigation on login page
  const hideNav = pathname === "/login";

  return (
    <div className="flex min-h-screen bg-background">
      {!hideNav && <SidebarNav />}
      
      <div className={`flex-1 ${!hideNav ? 'md:ml-64' : ''}`}>
        <main className="pb-0">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
        </main>
        
        {!hideNav && (
          <>
            <MobileNav />
            
            {/* Floating Action Button for adding trades */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40"
            >
              <Link href="/trade-entry">
                <GradientButton
                  className="h-12 w-12 rounded-full shadow-lg md:h-14 md:w-14 gradient-primary"
                >
                  <Plus className="h-6 w-6" />
                  <span className="sr-only">Add trade</span>
                </GradientButton>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};