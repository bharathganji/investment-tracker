import { 
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
} from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";

export function DetailedReports() {
  return (
    <EnhancedCard className="rounded-xl" animateOnHover>
      <EnhancedCardHeader>
        <EnhancedCardTitle>Detailed Reports</EnhancedCardTitle>
        <EnhancedCardDescription>
          Export and analyze your trading data
        </EnhancedCardDescription>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Monthly Performance Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Asset Allocation Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Trade History Export (CSV)
          </Button>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}