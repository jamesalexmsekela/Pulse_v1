// app/models/User.ts
export type UserProfile = {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    preferences?: string[]; // Interest categories like 'Tech', 'Music', etc.
    maxDistance?: number;   // User's preferred radius in km
    pushToken?: string;
  };
  