"use client";

import { TradeForm } from "@/app/_components/trade-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TradeEntryPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Trade</CardTitle>
          <CardDescription>
            Record a new trade with details and auto-calculated fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TradeForm />
        </CardContent>
      </Card>
    </div>
  );
}
