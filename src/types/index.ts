
export interface Room {
  id: string;
  roomNumber: string;
  type: 'Single' | 'Double Shared Bath' | 'Suite';
  capacity: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  floor: number;
  building: string;
  amenities: string[]; // e.g., ["AC", "WiFi", "Private Bath"]
  rent: number;
}

export interface AllocationRule {
  id: string;
  name: string;
  criteria: string; // e.g., "Academic Year", "Disability Status", "GPA"
  priority: number; // Lower number means higher priority
  value?: string | number | boolean; // e.g., "Senior", true, 3.5
  isEnabled: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  author: string; // For now, just "Admin"
}
