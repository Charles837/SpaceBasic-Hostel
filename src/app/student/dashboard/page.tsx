import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ListChecks, FileText, Bell, CalendarClock, Home, Info } from "lucide-react";
import Image from "next/image";

export default function StudentDashboardPage() {
  // Placeholder data
  const roomStatus = {
    status: "Allocated", // "Not Applied", "Pending", "Allocated"
    roomDetails: "Room A101, North Hall",
  };
  const applicationDeadline = "2024-08-15";
  const upcomingEvents = [
    { title: "Move-in Day", date: "2024-09-01", description: "Collect your keys and settle in." },
    { title: "Welcome Orientation", date: "2024-09-02", description: "Meet fellow residents and staff." },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your accommodation status.</p>
        </div>
         <Image 
            src="https://placehold.co/200x100.png" 
            alt="Campus banner" 
            width={200} 
            height={100} 
            className="rounded-lg shadow-md"
            data-ai-hint="university campus students"
          />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Room Status" 
          value={roomStatus.status} 
          icon={Home} 
          description={roomStatus.status === "Allocated" ? roomStatus.roomDetails : "No room allocated yet."}
          className={roomStatus.status === "Allocated" ? "bg-green-100 dark:bg-green-900/30 border-green-500" : "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500"}
        />
        <StatCard 
          title="Application Deadline" 
          value={new Date(applicationDeadline).toLocaleDateString()} 
          icon={CalendarClock} 
          description="Ensure your application is submitted on time."
        />
        <StatCard 
          title="Notifications" 
          value="3 Unread" 
          icon={Bell} 
          description="Check your latest updates and messages."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <QuickActionCard
          title="Room Application"
          description="Submit or view your room application and preferences."
          actionText={roomStatus.status === "Not Applied" ? "Apply Now" : "View Application"}
          actionHref="/student/apply"
          icon={FileText}
        />
        <QuickActionCard
          title="My Profile"
          description="Update your personal information and contact details."
          actionText="Go to Profile"
          actionHref="/student/profile"
          icon={ListChecks} // Changed from User to ListChecks as User icon is already in UserNav
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <CalendarClock className="h-6 w-6" />
            Upcoming Deadlines & Events
          </CardTitle>
          <CardDescription>Stay informed about important dates and activities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <Alert key={index} className="border-l-4 border-accent">
                <Info className="h-4 w-4 text-accent" />
                <AlertTitle className="font-semibold text-accent">{event.title} - {new Date(event.date).toLocaleDateString()}</AlertTitle>
                <AlertDescription>{event.description}</AlertDescription>
              </Alert>
            ))
          ) : (
            <p className="text-muted-foreground">No upcoming events or deadlines.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
