
"use client";

import React, { useEffect, useState } from "react";
import { Users, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const [roomNumber, setRoomNumber] = useState("");
  const [block, setBlock] = useState("");
  const [roomType, setRoomType] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [floor, setFloor] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setApplications(data);
      })
      .catch(() => {
        toast({ title: "Failed to load applications", variant: "destructive" });
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [toast]);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast({ title: `Application ${status}` });
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message, variant: "destructive" });
    }
  }

  function openAssignModal(app: any) {
    setSelectedApp(app);
    setRoomNumber(app.assignedRoom?.roomNumber ?? "");
    setBlock(app.assignedRoom?.block ?? "");
    setRoomType(app.assignedRoom?.roomType ?? "");
    setRentAmount(app.assignedRoom?.rentAmount ?? "");
    setFloor(app.assignedRoom?.floor ?? "");
    setMoveInDate(app.assignedRoom?.moveInDate ? format(new Date(app.assignedRoom.moveInDate), 'yyyy-MM-dd') : "");
    setAssignOpen(true);
  }

  function openViewRoom(app: any) {
    setSelectedApp(app);
    setViewOpen(true);
  }

  function openRoomDetails(app: any) {
    setSelectedApp(app);
    setRoomOpen(true);
  }

  // When a row is clicked, open view dialog if room assigned, otherwise open assign modal
  function onRowClick(app: any) {
    setSelectedApp(app);
    setViewOpen(true);
  }

  async function submitAssignment() {
    if (!selectedApp) return;
    const payload = {
      status: "approved",
      assignedRoom: {
        roomNumber,
        block,
        floor,
        roomType,
        rentAmount,
        moveInDate: moveInDate || new Date().toISOString(),
      },
    };
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to assign room");
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? updated : a)));
      setAssignOpen(false);
      toast({ title: "Room assigned", description: "Application approved and room assigned." });
    } catch (err: any) {
      toast({ title: "Assignment failed", description: err?.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Student Applications</h1>
          <p className="text-muted-foreground">Review and manage student room applications.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
          <CardDescription>
            A list of recent student applications submitted through the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading applications…</p>
          ) : applications.length === 0 ? (
            <p className="text-muted-foreground">No applications submitted yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow
                    key={app.id}
                    onClick={() => onRowClick(app)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      const key = (e as any).key;
                      if (key === "Enter" || key === " ") onRowClick(app);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{app.fullName}</TableCell>
                    <TableCell>{app.studentId}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      {app.assignedRoom?.roomNumber ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openRoomDetails(app); }}
                            className="flex items-center gap-2 text-left"
                            aria-label={`View room details for ${app.assignedRoom.roomNumber}`}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium text-primary hover:underline">{app.assignedRoom.roomNumber}</div>
                              <div className="text-xs text-muted-foreground">{app.assignedRoom.block ?? ''}</div>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">—</span>
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openAssignModal(app); }}>Assign</Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={app.status === "pending" ? "outline" : app.status === "approved" ? "secondary" : "destructive"}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(app.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); updateStatus(app.id, "approved"); }}>Approve</Button>
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); updateStatus(app.id, "rejected"); }}>Reject</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Room & Approve</DialogTitle>
            <DialogDescription>Enter room details to assign to the applicant.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Room Number</Label>
              <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g., A101" />
            </div>
            <div>
              <Label>Block / Building</Label>
              <Input value={block} onChange={(e) => setBlock(e.target.value)} placeholder="e.g., Block B" />
            </div>
            <div>
              <Label>Floor</Label>
              <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g., 2" />
            </div>
            <div>
              <Label>Room Type</Label>
              <Select onValueChange={(v) => setRoomType(v)} defaultValue={roomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rent Amount</Label>
              <Input value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="e.g., 250.00" />
            </div>
            <div>
              <Label>Move-in Date</Label>
              <Input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setAssignOpen(false)}>Cancel</Button>
              <Button onClick={submitAssignment}>Assign & Approve</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={roomOpen} onOpenChange={setRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>Details for the assigned room.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <div className="text-xs text-muted-foreground">Room No.</div>
              <div className="font-medium">{selectedApp?.assignedRoom?.roomNumber ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="font-medium">{selectedApp?.assignedRoom?.roomType ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Building</div>
              <div className="font-medium">{selectedApp?.assignedRoom?.block ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Floor</div>
              <div className="font-medium">{selectedApp?.assignedRoom?.floor ?? '—'}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground">Rent Amount</div>
              <div className="font-medium">{selectedApp?.assignedRoom?.rentAmount ? `${selectedApp.assignedRoom.rentAmount}` : '—'}</div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigned Room Details</DialogTitle>
            <DialogDescription>Details for the room assigned to the applicant.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <div className="text-xs text-muted-foreground">Applicant</div>
              <div className="font-medium">{selectedApp?.fullName ?? '—'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Student ID</div>
                <div className="font-medium">{selectedApp?.studentId ?? '—'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{selectedApp?.email ?? '—'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="font-medium">{selectedApp?.phoneNumber ?? '—'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Academic Year</div>
                <div className="font-medium">{selectedApp?.academicYear ?? '—'}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Preferred Room Type</div>
              <div className="font-medium">{selectedApp?.preferredRoomType ?? '—'}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Roommate Preference</div>
              <div className="font-medium">{selectedApp?.roommatePreference ?? '—'}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Special Needs / Accommodations</div>
              <div className="font-medium">{selectedApp?.specialNeeds ?? '—'}</div>
            </div>

            {/* Room details are shown in a separate dialog */}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
