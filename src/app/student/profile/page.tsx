
"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Edit, Mail, Phone, BookOpen, CalendarDays, ShieldAlert, User } from "lucide-react";
import Image from "next/image";

// Mock student data - in a real app, this would come from an API
const studentProfileData = {
  fullName: "Alex Johnson",
  studentId: "S123456",
  email: "alex.johnson@example.com",
  phoneNumber: "+1 (555) 123-4567",
  program: "Computer Science",
  academicYear: "Junior",
  profilePictureUrl: "https://placehold.co/128x128.png",
  emergencyContact: {
    name: "Sarah Johnson",
    relationship: "Mother",
    phone: "+1 (555) 987-6543",
  },
  dateOfBirth: "1999-07-15", // ISO string
  address: "123 University Ave, Techville, CA 90210",
};

interface ProfileDetailProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined | null;
}

const ProfileDetailItem: React.FC<ProfileDetailProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 py-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-card-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{value || "Not specified"}</p>
    </div>
  </div>
);


export default function StudentProfilePage() {
  const [profileData, setProfileData] = React.useState(studentProfileData);
  // In a real app, you'd have an editing state and handler functions

  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <UserCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">My Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>
      </div>

      <Card className="shadow-xl border-border">
        <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
              <AvatarImage src={profileData.profilePictureUrl} alt={profileData.fullName} data-ai-hint="user avatar person" />
              <AvatarFallback className="text-3xl">{getInitials(profileData.fullName)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl text-primary">{profileData.fullName}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">{profileData.studentId}</CardDescription>
              <p className="text-sm text-accent">{profileData.program} - {profileData.academicYear}</p>
            </div>
            <Button variant="outline" className="sm:ml-auto mt-4 sm:mt-0">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-x-6">
              <ProfileDetailItem icon={Mail} label="Email Address" value={profileData.email} />
              <ProfileDetailItem icon={Phone} label="Phone Number" value={profileData.phoneNumber} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Academic Details</h3>
             <div className="grid md:grid-cols-2 gap-x-6">
              <ProfileDetailItem icon={BookOpen} label="Program/Major" value={profileData.program} />
              <ProfileDetailItem icon={CalendarDays} label="Academic Year" value={profileData.academicYear} />
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Personal Information</h3>
             <div className="grid md:grid-cols-2 gap-x-6">
                <ProfileDetailItem icon={User} label="Date of Birth" value={new Date(profileData.dateOfBirth).toLocaleDateString()} />
                <ProfileDetailItem icon={User} label="Address" value={profileData.address} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Emergency Contact</h3>
            <div className="grid md:grid-cols-2 gap-x-6">
              <ProfileDetailItem icon={ShieldAlert} label="Contact Name" value={profileData.emergencyContact.name} />
              <ProfileDetailItem icon={Phone} label="Contact Phone" value={profileData.emergencyContact.phone} />
               <ProfileDetailItem icon={User} label="Relationship" value={profileData.emergencyContact.relationship} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 border-t">
            <p className="text-xs text-muted-foreground">
                To update your information, please click the "Edit Profile" button. 
                Ensure all details are accurate and up-to-date.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

