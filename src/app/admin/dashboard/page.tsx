import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, SlidersHorizontal, BarChart3, FileCheck2, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Placeholder data for recent activity and pending tasks
const recentActivities = [
  { id: 1, description: "New room application received from John Doe.", timestamp: "2 hours ago", type: "application" },
  { id: 2, description: "Room A101 maintenance request marked as resolved.", timestamp: "5 hours ago", type: "maintenance" },
  { id:3, description: "Allocation algorithm settings updated.", timestamp: "1 day ago", type: "system" },
];

const pendingTasks = [
  { id: 1, title: "Review 5 new applications", priority: "High", dueDate: "2024-08-10" },
  { id: 2, title: "Finalize room assignments for Block B", priority: "Medium", dueDate: "2024-08-15" },
  { id: 3, title: "Prepare welcome packets", priority: "Low", dueDate: "2024-08-20" },
];


export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the SafoRoom system and quick actions.</p>
        </div>
        <Image 
            src="https://placehold.co/200x100.png" 
            alt="Admin panel banner" 
            width={200} 
            height={100} 
            className="rounded-lg shadow-md"
            data-ai-hint="data charts graphs"
          />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value="520" icon={Building} description="+5 since last month" />
        <StatCard title="Occupied Rooms" value="480" icon={FileCheck2} description="92% occupancy rate" />
        <StatCard title="Pending Applications" value="35" icon={Users} description="Needs review" className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500" />
        <StatCard title="System Alerts" value="2" icon={AlertCircle} description="Critical issues" className="bg-red-100 dark:bg-red-900/30 border-red-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <QuickActionCard
          title="Manage Rooms"
          description="View, add, edit, or delete room information."
          actionText="Go to Room Management"
          actionHref="/admin/rooms"
          icon={Building}
        />
        <QuickActionCard
          title="Allocation Rules"
          description="Configure priority rules for the allocation algorithm."
          actionText="Configure Rules"
          actionHref="/admin/allocation/configure"
          icon={SlidersHorizontal}
        />
        <QuickActionCard
          title="View Reports"
          description="Generate and view reports on room occupancy and applications."
          actionText="Access Reports"
          actionHref="/admin/reports"
          icon={BarChart3}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Recent Activity</CardTitle>
            <CardDescription>Latest system events and user actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${activity.type === 'application' ? 'bg-blue-500' : activity.type === 'maintenance' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <div>
                    <p className="text-sm text-card-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Pending Tasks</CardTitle>
            <CardDescription>Tasks requiring your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium text-card-foreground">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "secondary" : "outline"}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{task.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {pendingTasks.length === 0 && <p className="text-center text-muted-foreground py-4">No pending tasks.</p>}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
