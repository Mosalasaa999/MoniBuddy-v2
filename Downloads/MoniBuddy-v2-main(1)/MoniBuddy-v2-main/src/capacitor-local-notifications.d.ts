declare module '@capacitor/local-notifications' {
  export interface LocalNotificationSchema {
    title: string;
    body: string;
    id: number;
    schedule?: { at: Date; every?: string; count?: number };
    sound?: string;
    actionTypeId?: string;
    extra?: Record<string, any>;
  }

  export interface ScheduleOptions {
    notifications: LocalNotificationSchema[];
  }

  export interface CancelOptions {
    notifications: { id: number }[];
  }

  export interface PermissionStatus {
    display: 'granted' | 'denied' | 'prompt';
  }

  export const LocalNotifications: {
    requestPermissions(): Promise<PermissionStatus>;
    schedule(options: ScheduleOptions): Promise<void>;
    cancel(options: CancelOptions): Promise<void>;
  };
}
