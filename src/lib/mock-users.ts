
export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, never store plain passwords. This is for prototype only.
  role: 'student' | 'admin';
  fullName?: string;
  studentId?: string;
}

// In a real app, passwords would be properly hashed and stored securely.
// For this prototype, we are storing them as is, which is not secure for production.
export let mockUsersStore: User[] = [
  { id: 'admin1', email: 'admin@example.com', passwordHash: 'password', role: 'admin', fullName: 'Admin User' },
  { id: 'student1', email: 'student@example.com', passwordHash: 'password', role: 'student', fullName: 'Alex Johnson', studentId: 'S123456' },
];

// Function to add a user (for admin to create students)
export const addMockUser = (user: Omit<User, 'id'>): User => {
  const newUser: User = { ...user, id: Date.now().toString() };
  // Check for existing email or studentId before adding
  const existing = mockUsersStore.find(u => u.email === newUser.email || (newUser.studentId && u.studentId === newUser.studentId));
  if (existing) {
    console.warn("Attempted to add a user with an existing email or student ID.");
    // In a real app, this would return an error or throw
    return existing; // Or handle error appropriately
  }
  mockUsersStore.push(newUser);
  console.log("User added to mock store:", newUser);
  console.log("Current mockUsersStore:", mockUsersStore);
  return newUser;
};

// Function to find a user by email (for login)
export const findMockUserByEmail = (email: string): User | undefined => {
  return mockUsersStore.find(user => user.email.toLowerCase() === email.toLowerCase());
};

    