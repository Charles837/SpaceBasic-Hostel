
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">System Reports</h1>
          <p className="text-muted-foreground">Generate and view reports on various aspects of the SafoRoom system.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            This section will provide options to generate and view different system reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Reporting features will be implemented here.</p>
          {/* Placeholder for report generation options and display area */}
        </CardContent>
      </Card>
    </div>
  );
}
