
"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDesc,
  DialogFooter,
  DialogHeader,
  DialogTitle as DialogHeadTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ListChecks, FileText, Bell, CalendarClock, Home, Info, Megaphone } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from 'react';
import type { Announcement } from "@/types";
// A bit of a hack for prototype to get announcements. In a real app, use an API.
import { getMockAnnouncements } from "@/app/admin/announcements/page"; 

interface DisplayEvent {
  title: string;
  date: string;
  description: string;
  formattedDate: string | null;
}

export default function StudentDashboardPage() {
  const [applicationDeadlineDisplay, setApplicationDeadlineDisplay] = useState<string | null>(null);
  const [displayedEvents, setDisplayedEvents] = useState<DisplayEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Placeholder data - original static data
  const roomStatus = {
    status: "Allocated", // "Not Applied", "Pending", "Allocated"
    roomDetails: "Room A101, North Hall",
  };
  const applicationDeadlineData = "2024-08-15"; // Keep original data separate
  const upcomingEventsData = [
    { title: "Move-in Day", date: "2024-09-01", description: "Collect your keys and settle in." },
    { title: "Welcome Orientation", date: "2024-09-02", description: "Meet fellow residents and staff." },
  ];

  useEffect(() => {
    setApplicationDeadlineDisplay(new Date(applicationDeadlineData).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
    setDisplayedEvents(
      upcomingEventsData.map(event => ({
        ...event,
        formattedDate: new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      }))
    );
    // Fetch mock announcements
    const fetchedAnnouncements = getMockAnnouncements();
    setAnnouncements(fetchedAnnouncements);

  }, []); // Empty dependency array to run once on mount after hydration

  const formatDate = (dateString: string) => {
    if (!dateString) return "Loading...";
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
          value={applicationDeadlineDisplay || "Loading..."} 
          icon={CalendarClock} 
          description="Ensure your application is submitted on time."
        />
        <StatCard 
          title="Notifications" 
          value={`${announcements.length} Unread`}
          icon={Bell} 
          description="Check your latest updates and messages."
        />
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Recent Announcements
          </CardTitle>
          <CardDescription>Important updates and information from the administration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <Dialog key={ann.id}>
                <DialogTrigger asChild>
                  <Alert className="border-l-4 border-primary cursor-pointer hover:bg-muted/50 transition-colors">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-semibold text-primary">{ann.title}</AlertTitle>
                    <AlertDescription className="text-sm">
                      Click to read the full announcement.
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      Posted on {formatDate(ann.createdAt).split(',')[0]}
                    </p>
                  </Alert>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogHeadTitle>{ann.title}</DialogHeadTitle>
                    <DialogDesc className="text-xs text-muted-foreground pt-1">
                      Published by {ann.author} on {formatDate(ann.createdAt)}
                    </DialogDesc>
                  </DialogHeader>
                  <div className="py-4 whitespace-pre-wrap text-sm max-h-[60vh] overflow-y-auto">
                    {ann.content}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <p className="text-muted-foreground">No announcements at this time.</p>
          )}
        </CardContent>
      </Card>

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
          icon={ListChecks} 
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
          {displayedEvents.length > 0 ? (
            displayedEvents.map((event, index) => (
              <Alert key={index} className="border-l-4 border-accent">
                <Info className="h-4 w-4 text-accent" />
                <AlertTitle className="font-semibold text-accent">{event.title} - {event.formattedDate || "Loading..."}</AlertTitle>
                <AlertDescription>{event.description}</AlertDescription>
              </Alert>
            ))
          ) : (
             applicationDeadlineDisplay === null ? <p className="text-muted-foreground">Loading events...</p> : <p className="text-muted-foreground">No upcoming events or deadlines.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

