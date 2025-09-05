import { TradeEntryForm } from "@/app/_components/trade-entry-form";
import { ProtectedRoute } from "@/components/protected-route";

export default function TradeEntryPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <TradeEntryForm />
      </div>
    </ProtectedRoute>
  );
}
