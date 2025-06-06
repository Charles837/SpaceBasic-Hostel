
"use client";

import * as React from "react";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Announcement } from "@/types";
import { Megaphone, Trash2, Edit3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock storage for announcements. In a real app, this would come from a database.
let mockAnnouncementsStore: Announcement[] = [
    { 
        id: "1", 
        title: "Welcome to SafoRoom!", 
        content: "We're excited to have you. Please make sure to complete your profile and application on time.", 
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        author: "Admin" 
    },
    { 
        id: "2", 
        title: "Maintenance Schedule Update", 
        content: "Please be advised that Block B will have water maintenance on Friday from 9 AM to 12 PM.", 
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        author: "Admin" 
    },
];

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(mockAnnouncementsStore);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<Announcement | null>(null);

  const handleCreateAnnouncement = (data: { title: string; content: string }) => {
    setIsSubmitting(true);
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
      author: "Admin", // Or get current admin user
    };

    setTimeout(() => { // Simulate API call
        if (editingAnnouncement) {
            const updatedAnnouncements = announcements.map(ann => ann.id === editingAnnouncement.id ? { ...ann, ...data, updatedAt: new Date().toISOString() } : ann);
            setAnnouncements(updatedAnnouncements);
            mockAnnouncementsStore = updatedAnnouncements; // Update mock store
            toast({ title: "Announcement Updated", description: "The announcement has been successfully updated." });
            setEditingAnnouncement(null);
        } else {
            setAnnouncements(prev => [newAnnouncement, ...prev]);
            mockAnnouncementsStore = [newAnnouncement, ...mockAnnouncementsStore]; // Update mock store
            toast({ title: "Announcement Published", description: "The new announcement is now live for students." });
        }
        setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
    setAnnouncements(updatedAnnouncements);
    mockAnnouncementsStore = updatedAnnouncements; // Update mock store
    toast({ title: "Announcement Deleted", description: "The announcement has been removed.", variant: "destructive" });
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    // Scroll to form or open in a dialog might be good UX here
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Megaphone className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Manage Announcements</h1>
          <p className="text-muted-foreground">Create, edit, and publish announcements for all students.</p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
          <CardDescription>
            {editingAnnouncement ? "Modify the details of the existing announcement below." : "Fill in the form below to publish a new announcement to all students."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementForm 
            onSubmit={handleCreateAnnouncement} 
            isSubmitting={isSubmitting}
            initialData={editingAnnouncement ? { title: editingAnnouncement.title, content: editingAnnouncement.content } : undefined}
            key={editingAnnouncement?.id || 'new'} // Re-render form when editing changes
          />
          {editingAnnouncement && (
            <Button variant="outline" onClick={() => setEditingAnnouncement(null)} className="mt-4">
              Cancel Edit
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-primary">Published Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-muted-foreground">No announcements published yet.</p>
        ) : (
          <div className="space-y-6">
            {announcements.map((ann) => (
              <Card key={ann.id} className="shadow-md overflow-hidden">
                <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10 p-4">
                  <CardTitle className="text-lg text-primary">{ann.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Published by {ann.author} on {formatDate(ann.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 whitespace-pre-wrap text-card-foreground">
                  {ann.content}
                </CardContent>
                <CardFooter className="p-4 bg-muted/50 flex justify-end gap-2">
                   <Button variant="outline" size="sm" onClick={() => handleEditAnnouncement(ann)}>
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the announcement titled "{ann.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAnnouncement(ann.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// This function needs to be accessible to the Student Dashboard as well.
// For simplicity, it's duplicated here. In a real app, this would be in a shared utility or fetched.
export function getMockAnnouncements(): Announcement[] {
  return mockAnnouncementsStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
