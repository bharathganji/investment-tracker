import { TradeEntryForm } from "@/app/_components/trade-entry-form";

export default function TradeEntryPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="heading-lg mb-2">Add New Trade Record</h1>
      <p className="text-muted-foreground mb-6">Record a new trade with details and fees</p> <TradeEntryForm />
    </div>
  );
}
