
import { Client, Post, User, UserRole } from '../types';

export const mockAgencyUser: User = {
  id: 'a1',
  name: 'Creative Director',
  email: 'studio@anusual.com',
  role: UserRole.AGENCY
};

export const mockClientUser: User = {
  id: 'c1',
  name: 'Marketing Manager',
  email: 'marketing@techcorp.com',
  role: UserRole.CLIENT,
  clientId: '1'
};

export const mockClients: Client[] = [
  { id: '1', name: 'TechCorp Solutions', logo: 'https://picsum.photos/seed/tech/100/100', industry: 'Technology', activePosts: 12, platforms: ['linkedin', 'facebook'], brandColor: '#1a1a1a' },
  { id: '2', name: 'Gourmet Delights', logo: 'https://picsum.photos/seed/food/100/100', industry: 'Food & Beverage', activePosts: 8, platforms: ['instagram', 'tiktok', 'facebook'], brandColor: '#f59e0b' },
  { id: '3', name: 'FitLife Gym', logo: 'https://picsum.photos/seed/gym/100/100', industry: 'Health & Fitness', activePosts: 5, platforms: ['instagram', 'facebook'], brandColor: '#ef4444' },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    clientId: '1',
    title: 'Future of AI 2024',
    content: 'Exploring the impact of AI on small businesses...',
    scheduledDate: '2024-01-05T10:00:00Z',
    platforms: ['linkedin', 'facebook'],
    status: 'scheduled',
    mediaUrl: 'https://picsum.photos/seed/ai/800/400'
  },
  {
    id: 'p2',
    clientId: '1',
    title: 'New Web Release',
    content: 'Our new platform is finally live and ready!',
    scheduledDate: '2024-01-15T09:00:00Z',
    platforms: ['facebook'],
    status: 'scheduled',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'p3',
    clientId: '2',
    title: 'Christmas Special Menu',
    content: 'Come try our holiday special starting this weekend!',
    scheduledDate: '2023-12-24T18:00:00Z',
    platforms: ['instagram', 'facebook'],
    status: 'published',
    mediaUrl: 'https://picsum.photos/seed/food2/800/400'
  }
];
