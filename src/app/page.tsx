import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-4 text-white">
      <div className="container flex max-w-4xl flex-col items-center justify-center gap-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Investment <span className="text-[hsl(200,90%,60%)]">Tracker</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
            Track your trades, analyze performance, and monitor your investment
            goals with ease.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 bg-white/10 transition-all duration-300 hover:bg-white/20">
            <CardHeader>
              <CardTitle className="text-xl">Dashboard</CardTitle>
              <CardDescription className="text-gray-300">
                Portfolio overview and performance charts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 transition-all duration-300 hover:bg-white/20">
            <CardHeader>
              <CardTitle className="text-xl">Add Trade</CardTitle>
              <CardDescription className="text-gray-300">
                Record new trades with auto-calculated fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/trade-entry">Add Trade</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 transition-all duration-300 hover:bg-white/20">
            <CardHeader>
              <CardTitle className="text-xl">Portfolio</CardTitle>
              <CardDescription className="text-gray-300">
                View holdings and current market value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 transition-all duration-300 hover:bg-white/20">
            <CardHeader>
              <CardTitle className="text-xl">Trade History</CardTitle>
              <CardDescription className="text-gray-300">
                All recorded trades with filtering options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/trade-history">View History</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 transition-all duration-300 hover:bg-white/20">
            <CardHeader>
              <CardTitle className="text-xl">Analytics</CardTitle>
              <CardDescription className="text-gray-300">
                Performance metrics, ROI, and charts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 transition-all duration-300 hover:bg-white/20">
            <CardHeader>
              <CardTitle className="text-xl">Goals</CardTitle>
              <CardDescription className="text-gray-300">
                Manage investment goals and track progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/goals">View Goals</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-2xl border-0 bg-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Get Started</CardTitle>
            <CardDescription className="text-gray-300">
              Start tracking your investments today
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="flex-1">
              <Link href="/trade-entry">Add Your First Trade</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="flex-1">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
