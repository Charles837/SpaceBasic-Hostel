"use client";

import * as React from "react";
import type { Room } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, PlusCircle, Eye, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Placeholder room data
const initialRooms: Room[] = [
  { id: "1", roomNumber: "A101", type: "Single", capacity: 1, status: "Available", floor: 1, building: "North Hall", amenities: ["AC", "WiFi"], rent: 500 },
  { id: "2", roomNumber: "B205", type: "Double Shared Bath", capacity: 2, status: "Occupied", floor: 2, building: "West Wing", amenities: ["WiFi"], rent: 350 },
  { id: "3", roomNumber: "C310", type: "Suite", capacity: 1, status: "Maintenance", floor: 3, building: "East Tower", amenities: ["AC", "WiFi", "Private Bath"], rent: 700 },
  { id: "4", roomNumber: "A102", type: "Single", capacity: 1, status: "Occupied", floor: 1, building: "North Hall", amenities: ["AC", "WiFi"], rent: 500 },
  { id: "5", roomNumber: "B206", type: "Double Shared Bath", capacity: 2, status: "Available", floor: 2, building: "West Wing", amenities: ["WiFi"], rent: 350 },
];

const roomTypes: Room['type'][] = ['Single', 'Double Shared Bath', 'Suite'];
const roomStatuses: Room['status'][] = ['Available', 'Occupied', 'Maintenance'];
const allAmenities = ["AC", "WiFi", "Private Bath", "Kitchenette", "Furnished"];


interface RoomFormProps {
  room?: Room | null;
  onSave: (room: Room) => void;
  onClose: () => void;
}

function RoomForm({ room: currentRoom, onSave, onClose }: RoomFormProps) {
  const [roomNumber, setRoomNumber] = React.useState(currentRoom?.roomNumber || "");
  const [type, setType] = React.useState<Room['type']>(currentRoom?.type || "Single");
  const [capacity, setCapacity] = React.useState(currentRoom?.capacity || 1);
  const [status, setStatus] = React.useState<Room['status']>(currentRoom?.status || "Available");
  const [floor, setFloor] = React.useState(currentRoom?.floor || 1);
  const [building, setBuilding] = React.useState(currentRoom?.building || "");
  const [amenities, setAmenities] = React.useState<string[]>(currentRoom?.amenities || []);
  const [rent, setRent] = React.useState(currentRoom?.rent || 0);

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !type || !building || capacity <= 0 || floor <=0 || rent <=0) {
        toast({ title: "Validation Error", description: "Please fill all required fields with valid values.", variant: "destructive"});
        return;
    }
    const newRoom: Room = {
      id: currentRoom?.id || Date.now().toString(),
      roomNumber, type, capacity, status, floor, building, amenities, rent
    };
    onSave(newRoom);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setAmenities(prev => checked ? [...prev, amenity] : prev.filter(a => a !== amenity));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value: Room['type']) => setType(value)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {roomTypes.map(rt => <SelectItem key={rt} value={rt}>{rt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} required min="1" />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
           <Select value={status} onValueChange={(value: Room['status']) => setStatus(value)}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {roomStatuses.map(rs => <SelectItem key={rs} value={rs}>{rs}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="floor">Floor</Label>
          <Input id="floor" type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))} required min="0" />
        </div>
        <div>
          <Label htmlFor="building">Building</Label>
          <Input id="building" value={building} onChange={(e) => setBuilding(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label htmlFor="rent">Rent (per month)</Label>
        <Input id="rent" type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} required min="0" step="0.01" />
      </div>
      <div>
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 p-2 border rounded-md">
          {allAmenities.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity}`} 
                checked={amenities.includes(amenity)} 
                onCheckedChange={(checked) => handleAmenityChange(amenity, Boolean(checked))}
              />
              <Label htmlFor={`amenity-${amenity}`} className="font-normal text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{currentRoom ? "Save Changes" : "Add Room"}</Button>
      </DialogFooter>
    </form>
  );
}


export function RoomManagementTable() {
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = React.useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = React.useState<Room | null>(null);
  const { toast } = useToast();

  const handleSaveRoom = (room: Room) => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === room.id ? room : r));
      toast({ title: "Room Updated", description: `Room ${room.roomNumber} has been updated.` });
    } else {
      setRooms([...rooms, room]);
      toast({ title: "Room Added", description: `Room ${room.roomNumber} has been added.` });
    }
    setIsFormOpen(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = () => {
    if (deletingRoom) {
      setRooms(rooms.filter(r => r.id !== deletingRoom.id));
      toast({ title: "Room Deleted", description: `Room ${deletingRoom.roomNumber} has been deleted.` });
      setDeletingRoom(null);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadgeVariant = (status: Room['status']) => {
    switch (status) {
      case 'Available': return 'default'; // Will use primary color based on theme
      case 'Occupied': return 'secondary';
      case 'Maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Input 
            type="search" 
            placeholder="Search rooms..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10" 
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingRoom(null); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              <DialogDescription>
                {editingRoom ? "Update the details for this room." : "Fill in the details for the new room."}
              </DialogDescription>
            </DialogHeader>
            <RoomForm 
              room={editingRoom} 
              onSave={handleSaveRoom} 
              onClose={() => { setIsFormOpen(false); setEditingRoom(null); }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.roomNumber}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.building}</TableCell>
                <TableCell>{room.floor}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(room.status)}>{room.status}</Badge>
                </TableCell>
                <TableCell>${room.rent.toFixed(2)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => setViewingRoom(room)}>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditingRoom(room); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeletingRoom(room)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {filteredRooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No rooms found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Room Dialog */}
      <Dialog open={!!viewingRoom} onOpenChange={() => setViewingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Details: {viewingRoom?.roomNumber}</DialogTitle>
            <DialogDescription>Detailed information about the room.</DialogDescription>
          </DialogHeader>
          {viewingRoom && (
            <div className="space-y-3 py-4 text-sm">
              <p><strong>Building:</strong> {viewingRoom.building}, Floor {viewingRoom.floor}</p>
              <p><strong>Type:</strong> {viewingRoom.type}</p>
              <p><strong>Capacity:</strong> {viewingRoom.capacity} person(s)</p>
              <p><strong>Status:</strong> <Badge variant={statusBadgeVariant(viewingRoom.status)}>{viewingRoom.status}</Badge></p>
              <p><strong>Rent:</strong> ${viewingRoom.rent.toFixed(2)} / month</p>
              <p><strong>Amenities:</strong> {viewingRoom.amenities.join(', ') || 'None'}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingRoom(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingRoom} onOpenChange={() => setDeletingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete room {deletingRoom?.roomNumber}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingRoom(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
