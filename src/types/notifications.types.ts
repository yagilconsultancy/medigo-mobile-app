export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  notification_type: string;
  data: Record<string, any>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  notification_type?: string | null;
}

export interface NotificationsResponse {
  success: boolean;
  data: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface LastMessage {
  id: string;
  content: string;
  sender_id: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  ride_id: string;
  driver_id: string;
  rider_id: string;
  is_active: boolean;
  last_message_at: string;
  unread_count: number;
  last_message: LastMessage | null;
}

export interface ChatListResponse {
  success: boolean;
  data: Conversation[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
