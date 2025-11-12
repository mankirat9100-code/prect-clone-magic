export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'consultant';
  timestamp: Date;
  isRead: boolean;
  deliveryMethod: 'app' | 'email';
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
}

export interface MessageThread {
  id: string;
  consultantName: string;
  consultantCompany: string;
  role: string;
  task: string;
  projectName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isFavorite: boolean;
  avatar: string;
  messages: Message[];
}

export type MessageFilter = 'all' | 'unread' | 'favorites';
