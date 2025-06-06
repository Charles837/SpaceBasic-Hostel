"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import type { AllocationRule } from "@/types";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ruleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Rule name is required."),
  criteria: z.string().min(1, "Criteria is required."),
  priority: z.number().min(1, "Priority must be at least 1.").max(100, "Priority cannot exceed 100."),
  value: z.string().optional(), // Can be string, number, or boolean representation
  isEnabled: z.boolean(),
});

const allocationConfigSchema = z.object({
  rules: z.array(ruleSchema),
  allocationStrategy: z.enum(["priority_based", "lottery", "manual"], { required_error: "Allocation strategy is required." }),
  conflictResolution: z.enum(["admin_intervention", "highest_priority_wins", "random_choice"], { required_error: "Conflict resolution method is required."}),
});

type AllocationConfigFormValues = z.infer<typeof allocationConfigSchema>;

// Placeholder initial rules
const initialRules: AllocationRule[] = [
  { id: "1", name: "Seniors First", criteria: "Academic Year", value: "Senior", priority: 1, isEnabled: true },
  { id: "2", name: "Disability Accommodation", criteria: "Special Need", value: "Disability", priority: 2, isEnabled: true },
  { id: "3", name: "High GPA", criteria: "GPA", value: ">=3.5", priority: 3, isEnabled: false },
];

const criteriaOptions = ["Academic Year", "Special Need", "GPA", "Distance from Home", "Previous Resident"];
const allocationStrategies = [
    {value: "priority_based", label: "Priority Based"}, 
    {value: "lottery", label: "Lottery System"}, 
    {value: "manual", label: "Manual Assignment"}
];
const conflictResolutions = [
    {value: "admin_intervention", label: "Admin Intervention"}, 
    {value: "highest_priority_wins", label: "Highest Priority Wins"},
    {value: "random_choice", label: "Random Choice"}
];


export function AllocationConfigForm() {
  const { toast } = useToast();
  const form = useForm<AllocationConfigFormValues>({
    resolver: zodResolver(allocationConfigSchema),
    defaultValues: {
      rules: initialRules,
      allocationStrategy: "priority_based",
      conflictResolution: "highest_priority_wins",
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  function onSubmit(data: AllocationConfigFormValues) {
    console.log("Allocation config data:", data);
    // Re-assign priorities based on order
    const orderedRules = data.rules.map((rule, index) => ({ ...rule, priority: index + 1 }));
    console.log("Ordered rules:", orderedRules);
    
    toast({
      title: "Configuration Saved!",
      description: "Allocation rules and strategy have been updated successfully.",
    });
  }

  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      move(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Overall Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="allocationStrategy"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Allocation Strategy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select strategy" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {allocationStrategies.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormDescription>Choose the primary method for allocating rooms.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="conflictResolution"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Conflict Resolution</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {conflictResolutions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormDescription>How to resolve cases where multiple applicants meet criteria for the same limited resources.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Priority Rules</CardTitle>
            <FormDescription>
              Define rules to prioritize applications. Drag and drop to reorder (higher in list means higher priority).
            </FormDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Card 
                key={field.id} 
                className="p-4 border rounded-md shadow-sm bg-card relative"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <button type="button" className="absolute left-1 top-1/2 -translate-y-1/2 cursor-grab p-1 text-muted-foreground hover:text-foreground">
                    <GripVertical size={20} />
                </button>
                <div className="pl-8 space-y-4">
                    <FormField
                    control={form.control}
                    name={`rules.${index}.name`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Rule Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Seniors First" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name={`rules.${index}.criteria`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Criteria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select criteria" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {criteriaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`rules.${index}.value`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., Senior, >=3.5" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                    <FormField
                        control={form.control}
                        name={`rules.${index}.isEnabled`}
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal">Enabled</FormLabel>
                        </FormItem>
                        )}
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="mr-1 h-4 w-4" /> Remove Rule
                    </Button>
                    </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ id: Date.now().toString(), name: "", criteria: "", priority: fields.length + 1, value: "", isEnabled: true })}
              className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Form>
  );
}
