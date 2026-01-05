"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const applicationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  studentId: z.string().regex(/^[A-Z0-9]{6,10}$/, { message: "Invalid student ID format." }),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number."}),
  preferredRoomType: z.enum(["single", "double_shared_bath", "suite"], { required_error: "Please select a room type."}),
  roommatePreference: z.string().optional(),
  specialNeeds: z.string().optional(),
  academicYear: z.string().min(1, { message: "Please select your academic year."}),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const roomTypes = [
  { id: "single", label: "Single Room" },
  { id: "double_shared_bath", label: "Double Room (Shared Bath)" },
  { id: "suite", label: "Suite (Private Bath)" },
];

const academicYears = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export function RoomApplicationForm() {
  const { toast } = useToast();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      studentId: "",
      email: "",
      phoneNumber: "",
      agreeToTerms: false,
    },
  });

  function onSubmit(data: ApplicationFormValues) {
    return (async () => {
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to submit application');
        }

        toast({
          title: 'Application Submitted!',
          description: 'Your room application has been received. We will review it shortly.',
          variant: 'default',
        });
        form.reset();
      } catch (err: any) {
        toast({
          title: 'Submission failed',
          description: err?.message ?? 'Unable to submit application',
          variant: 'destructive',
        });
      }
    })();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="S123456" {...field} />
                </FormControl>
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Academic Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="preferredRoomType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Preferred Room Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                >
                  {roomTypes.map((type) => (
                    <FormItem key={type.id} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={type.id} />
                      </FormControl>
                      <FormLabel className="font-normal">{type.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roommatePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roommate Preference (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Specify any roommate preferences (e.g., study habits, major)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                While we try to accommodate preferences, roommate matching is not guaranteed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Needs or Accommodations (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any special needs or medical conditions requiring accommodation."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the <a href="/terms" target="_blank" className="text-primary underline hover:text-primary/80">terms and conditions</a> of room allocation.
                </FormLabel>
                <FormDescription>
                  Please read the terms carefully before submitting your application.
                </FormDescription>
                 <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
