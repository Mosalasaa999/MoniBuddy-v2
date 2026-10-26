import { LocalNotifications } from '@capacitor/local-notifications';

export interface GoalNudgeSchedule {
  id: number;
  title: string;
  body: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'payday';
  hour: number;
  minute: number;
}

/**
 * MoniBuddy Local Goal Commitment & Push Notification Service
 * FAIS / Banks Act Compliant: Deterministic behavioural nudges and shadow-ledger goal trackers.
 * Directs user to make manual allocations in their own real banking app (Calculator Loophole).
 */
export class NotificationService {
  /**
   * Request local notification permissions on Android / iOS
   */
  static async requestPermission(): Promise<boolean> {
    try {
      const perm = await LocalNotifications.requestPermissions();
      return perm.display === 'granted';
    } catch (e) {
      console.warn('LocalNotifications permission request failed:', e);
      return false;
    }
  }

  /**
   * Schedule a recurring behavioural nudge goal commitment reminder
   */
  static async scheduleGoalNudge(schedule: GoalNudgeSchedule): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return false;
    }

    try {
      // Cancel existing notification with same ID if any
      await LocalNotifications.cancel({ notifications: [{ id: schedule.id }] });

      const now = new Date();
      const scheduledDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        schedule.hour,
        schedule.minute,
        0
      );

      // If time has passed today, schedule for tomorrow / next interval
      if (scheduledDate.getTime() <= now.getTime()) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      let every: 'day' | 'week' | 'month' = 'week';
      if (schedule.frequency === 'daily') every = 'day';
      if (schedule.frequency === 'weekly' || schedule.frequency === 'payday') every = 'week';

      await LocalNotifications.schedule({
        notifications: [
          {
            title: schedule.title || 'MoniBuddy Goal Stash Reminder 🎯',
            body: schedule.body || `Protect your R${schedule.amount} weekend buffer before the groove starts! Open your banking app to stash safely.`,
            id: schedule.id,
            schedule: { at: scheduledDate, every },
            sound: 'default',
            actionTypeId: 'GOAL_ACTION',
            extra: {
              targetAmount: schedule.amount,
              category: schedule.title,
            },
          },
        ],
      });

      return true;
    } catch (e) {
      console.error('Failed to schedule local notification:', e);
      return false;
    }
  }

  /**
   * Trigger an immediate test notification for debugging on itel V54
   */
  static async sendTestNudge(title: string, body: string, amount: number): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title || 'MoniBuddy Test Nudge 🚨',
            body: body || `Stash R${amount} into your safety pot now before weekend expenses hit!`,
            id: Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
            sound: 'default',
            extra: { targetAmount: amount },
          },
        ],
      });
      return true;
    } catch (e) {
      console.error('Test notification error:', e);
      return false;
    }
  }

  /**
   * Open external banking app via intent or fallback URI scheme
   */
  static openBankingApp() {
    try {
      // Universal intent or fallback to browser / app launcher
      const intentUrl = 'intent://#Intent;scheme=upi;package=za.co.capitecbank.client;end;';
      window.location.href = intentUrl;
    } catch (e) {
      console.warn('Banking app intent redirect failed', e);
    }
  }
}
