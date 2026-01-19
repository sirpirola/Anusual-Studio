
export enum UserRole {
  AGENCY = 'AGENCY',
  CLIENT = 'CLIENT'
}

export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';

export interface Post {
  id: string;
  clientId: string;
  title: string;
  content: string;
  scheduledDate: string;
  platforms: Platform[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaUrl?: string;
}

export interface Todo {
  id: string;
  clientId: string;
  task: string;
  completed: boolean;
  assignedTo: UserRole;
  dueDate?: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  industry: string;
  activePosts: number;
  platforms: Platform[];
  brandColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string; 
}
