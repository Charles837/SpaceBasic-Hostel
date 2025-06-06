
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users } from "lucide-react";
import { addMockUser, mockUsersStore, User } from "@/lib/mock-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const studentAccountSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  studentId: z.string().min(3, "Student ID is required.").regex(/^[A-Z0-9]+$/, "Student ID can only contain uppercase letters and numbers."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type StudentAccountFormValues = z.infer<typeof studentAccountSchema>;

export default function ManageStudentsPage() {
  const { toast } = useToast();
  // Initialize students state with a function to ensure it's only called once on mount
  const [students, setStudents] = React.useState<User[]>(() => mockUsersStore.filter(u => u.role === 'student'));

  const form = useForm<StudentAccountFormValues>({
    resolver: zodResolver(studentAccountSchema),
    defaultValues: {
      fullName: "",
      studentId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: StudentAccountFormValues) => {
    const existingUserByEmail = mockUsersStore.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    const existingUserByStudentId = mockUsersStore.find(u => u.studentId?.toLowerCase() === data.studentId.toLowerCase());

    if (existingUserByEmail) {
      toast({
        title: "Error Creating Account",
        description: "A user with this email address already exists.",
        variant: "destructive",
      });
      return;
    }
    if (existingUserByStudentId) {
      toast({
        title: "Error Creating Account",
        description: "A user with this Student ID already exists.",
        variant: "destructive",
      });
      return;
    }
    
    addMockUser({
      email: data.email,
      passwordHash: data.password, // Storing plain password for prototype
      role: 'student',
      fullName: data.fullName,
      studentId: data.studentId,
    });

    // Update the local state to reflect the new list of students
    setStudents([...mockUsersStore.filter(u => u.role === 'student')]);

    toast({
      title: "Student Account Created",
      description: `Account for ${data.fullName} has been successfully created.`,
    });
    form.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Manage Student Accounts</h1>
          <p className="text-muted-foreground">Create new student accounts and view existing ones.</p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-6 w-6 text-primary" /> Create New Student Account</CardTitle>
          <CardDescription>Fill in the form below to create a new student account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID*</FormLabel>
                      <FormControl><Input placeholder="e.g., S987654" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl><Input type="email" placeholder="e.g., jane.doe@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <UserPlus className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Creating Account..." : "Create Student Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Existing Student Accounts</CardTitle>
           <CardDescription>A list of all student accounts in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-muted-foreground">No student accounts created yet.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell><Badge variant="outline" className="border-green-500 text-green-700">{student.role}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    