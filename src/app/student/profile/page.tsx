
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Edit, Mail, Phone, BookOpen, CalendarDays, ShieldAlert, User, Save, X, UploadCloud } from "lucide-react";

// Mock student data - in a real app, this would come from an API
const initialStudentProfileData = {
  fullName: "Alex Johnson",
  studentId: "S123456",
  email: "alex.johnson@example.com",
  phoneNumber: "+1 (555) 123-4567",
  program: "Computer Science",
  academicYear: "Junior",
  profilePictureUrl: "https://placehold.co/128x128.png",
  emergencyContactName: "Sarah Johnson",
  emergencyContactRelationship: "Mother",
  emergencyContactPhone: "+1 (555) 987-6543",
  dateOfBirth: "1999-07-15", // ISO string
  address: "123 University Ave, Techville, CA 90210",
};

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  studentId: z.string().regex(/^[A-Z0-9]{6,10}$/, "Invalid student ID format.").optional(), // Student ID might not be editable
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format."),
  program: z.string().min(2, "Program name is required.").optional(), // Program might not be editable by student
  academicYear: z.string().min(2, "Academic year is required.").optional(), // Academic year might not be editable by student
  profilePictureUrl: z.string().url("Must be a valid URL for profile picture.").or(z.literal("")).or(z.string().startsWith("data:image/")).optional(), // Allow data URLs
  emergencyContactName: z.string().min(2, "Emergency contact name is required."),
  emergencyContactRelationship: z.string().min(2, "Emergency contact relationship is required."),
  emergencyContactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid emergency contact phone number."),
  dateOfBirth: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Invalid date of birth."),
  address: z.string().min(5, "Address must be at least 5 characters."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileDetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined | null;
}

const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 py-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-card-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{value || "Not specified"}</p>
    </div>
  </div>
);


export default function StudentProfilePage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = React.useState(initialStudentProfileData);
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  });

  React.useEffect(() => {
    form.reset(profileData);
  }, [profileData, form, isEditing]);


  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }

  const handleEditToggle = () => {
    if (isEditing) {
      form.reset(profileData); 
    } else {
      form.reset(profileData); 
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Updated profile data:", data);
    setProfileData(data); 
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };
  
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return "Invalid Date";
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("profilePictureUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const watchedProfilePictureUrl = form.watch("profilePictureUrl");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <UserCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">My Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-xl border-border">
            <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
                    <AvatarImage 
                        src={watchedProfilePictureUrl || profileData.profilePictureUrl} 
                        alt={profileData.fullName} 
                        data-ai-hint="user avatar person"
                    />
                    <AvatarFallback className="text-3xl">{getInitials(profileData.fullName)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                    <Button 
                        type="button"
                        size="sm" 
                        variant="outline"
                        className="absolute -bottom-2 -right-2 bg-background hover:bg-muted"
                        onClick={() => fileInputRef.current?.click()}
                        title="Change profile picture"
                    >
                        <UploadCloud className="h-4 w-4" />
                    </Button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                    className="hidden"
                />
                
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl text-primary">{isEditing ? form.watch("fullName") : profileData.fullName}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{profileData.studentId}</CardDescription>
                  <p className="text-sm text-accent">{profileData.program} - {profileData.academicYear}</p>
                </div>

                <div className="sm:ml-auto mt-4 sm:mt-0 flex gap-2">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={handleEditToggle}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button type="button" variant="outline" onClick={handleEditToggle}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-x-6">
                  {isEditing ? (
                    <>
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="py-2">
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="py-2">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="py-2">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input type="tel" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <ProfileDetailItem icon={User} label="Full Name" value={profileData.fullName} />
                      <ProfileDetailItem icon={Mail} label="Email Address" value={profileData.email} />
                      <ProfileDetailItem icon={Phone} label="Phone Number" value={profileData.phoneNumber} />
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Academic Details</h3>
                 <div className="grid md:grid-cols-2 gap-x-6">
                  <ProfileDetailItem icon={BookOpen} label="Program/Major" value={profileData.program} />
                  <ProfileDetailItem icon={CalendarDays} label="Academic Year" value={profileData.academicYear} />
                  <ProfileDetailItem icon={User} label="Student ID" value={profileData.studentId} />
                </div>
                 <p className="text-xs text-muted-foreground mt-2">Student ID, Program, and Academic Year are typically non-editable by students. Contact administration for changes.</p>
              </div>
              
              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Personal Information</h3>
                 <div className="grid md:grid-cols-2 gap-x-6">
                    {isEditing ? (
                        <>
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                <FormItem className="py-2">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                <FormItem className="py-2 md:col-span-2">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </>
                    ) : (
                        <>
                            <ProfileDetailItem icon={CalendarDays} label="Date of Birth" value={formatDateForDisplay(profileData.dateOfBirth)} />
                            <ProfileDetailItem icon={User} label="Address" value={profileData.address} />
                        </>
                    )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Emergency Contact</h3>
                <div className="grid md:grid-cols-2 gap-x-6">
                  {isEditing ? (
                    <>
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem className="py-2">
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactRelationship"
                        render={({ field }) => (
                          <FormItem className="py-2">
                            <FormLabel>Relationship</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem className="py-2">
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl><Input type="tel" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <ProfileDetailItem icon={ShieldAlert} label="Contact Name" value={profileData.emergencyContactName} />
                      <ProfileDetailItem icon={User} label="Relationship" value={profileData.emergencyContactRelationship} />
                      <ProfileDetailItem icon={Phone} label="Contact Phone" value={profileData.emergencyContactPhone} />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 border-t">
                <p className="text-xs text-muted-foreground">
                    {isEditing 
                        ? "Make your changes and click 'Save Changes'. To change your profile picture, click the upload icon on the image." 
                        : 'To update your information, please click the "Edit Profile" button. Ensure all details are accurate and up-to-date.'
                    }
                </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
