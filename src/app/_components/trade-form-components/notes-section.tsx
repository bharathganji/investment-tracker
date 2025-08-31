"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNotesChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes (Optional)</Label>
      <Textarea
        id="notes"
        name="notes"
        value={notes}
        onChange={handleNotesChange}
        rows={3}
        placeholder="Additional notes about this trade..."
      />
    </div>
  );
}