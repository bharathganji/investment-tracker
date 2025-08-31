"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="container flex max-w-6xl flex-col items-center justify-center gap-12 px-4 py-8">
        <motion.div
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading-xl md:heading-2xl">
            Investment <span className="text-primary">Tracker</span>
          </h1>
          <p className="body-text mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Track your trades, analyze performance, and monitor your investment
            goals with ease.
          </p>
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedCard
            className="rounded-xl border-0 bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            animateOnHover
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl">
                Dashboard
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Portfolio overview and performance charts
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            className="rounded-xl border-0 bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            animateOnHover
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl">
                Add Trade
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Record new trades with auto-calculated fees
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/trade-entry">Add Trade</Link>
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            className="rounded-xl border-0 bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            animateOnHover
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl">
                Portfolio
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                View holdings and current market value
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            className="rounded-xl border-0 bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            animateOnHover
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl">
                Trade History
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                All recorded trades with filtering options
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/trade-history">View History</Link>
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            className="rounded-xl border-0 bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            animateOnHover
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl">
                Analytics
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Performance metrics, ROI, and charts
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/analytics">View Analytics</Link>
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            className="rounded-xl border-0 bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            animateOnHover
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl">Goals</EnhancedCardTitle>
              <EnhancedCardDescription>
                Manage investment goals and track progress
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <Button asChild className="w-full" variant="default">
                <Link href="/goals">View Goals</Link>
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      </div>
    </main>
  );
}
