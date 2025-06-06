import { RoomManagementTable } from "@/components/admin/room-management-table";
import { Building } from "lucide-react";

export default function RoomManagementPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Building className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Room Management</h1>
          <p className="text-muted-foreground">Manage all rooms within the SafoRoom system.</p>
        </div>
      </div>
      <RoomManagementTable />
    </div>
  );
}
