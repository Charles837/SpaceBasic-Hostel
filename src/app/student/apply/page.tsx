import { RoomApplicationForm } from "@/components/student/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ApplyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Room Application</h1>
          <p className="text-muted-foreground">Fill out the form below to apply for a room.</p>
        </div>
      </div>
      
      <Card className="shadow-xl border-border">
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Please provide accurate information. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
