
"use client";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { AppLogo } from "@/components/layout/app-logo";
import { findMockUserByEmail } from "@/lib/mock-users"; // Updated import

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["student", "admin"], { required_error: "You must select a role." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "student@example.com", // Default for easy testing
      password: "password",
      role: "student",
    },
  });

  function onSubmit(data: LoginFormValues) {
    console.log("Login attempt:", data);
    const user = findMockUserByEmail(data.email);

    if (user && user.passwordHash === data.password && user.role === data.role) {
      toast({
        title: "Login Successful",
        description: `Welcome, ${user.fullName || data.role}! Redirecting...`,
      });

      setTimeout(() => {
        if (user.role === "student") {
          router.push("/student/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      }, 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email, password, or role. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-card shadow-xl rounded-lg border border-border">
      <div className="flex flex-col items-center space-y-2">
        <AppLogo />
        <h2 className="text-2xl font-bold text-center text-card-foreground font-headline">Sign in to SafoRoom</h2>
        <p className="text-sm text-muted-foreground">Enter your credentials to access your account.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Login as:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="student" />
                      </FormControl>
                      <FormLabel className="font-normal">Student</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="admin" />
                      </FormControl>
                      <FormLabel className="font-normal">Admin</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <LogIn className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

    