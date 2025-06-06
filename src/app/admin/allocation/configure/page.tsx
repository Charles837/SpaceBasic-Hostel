import { AllocationConfigForm } from "@/components/admin/allocation-config-form";
import { SlidersHorizontal } from "lucide-react";

export default function AllocationConfigurePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <SlidersHorizontal className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Allocation Configuration</h1>
          <p className="text-muted-foreground">Set up and manage the rules for the room allocation algorithm.</p>
        </div>
      </div>
      <AllocationConfigForm />
    </div>
  );
}
