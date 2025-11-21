import { CalendarProvider } from '../interfaces/CalendarProvider';
import { CalendarEvent } from '@shared/types';

/**
 * Unified provider that fetches events from all connected calendar accounts
 * (Google, iCloud, etc.) for the authenticated user.
 */
export class UnifiedCalendarProvider implements CalendarProvider {
    constructor(private userId: string) { }

    async getEvents(_start: Date, _end: Date): Promise<CalendarEvent[]> {
        try {
            // Fetch events from all connected accounts
            const res = await fetch(`http://localhost:3001/api/calendar/all-events/${this.userId}`);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Failed to fetch events:', errorData);
                return [];
            }

            const events: any[] = await res.json();

            return events.map(event => {
                // Handle both Google Calendar format and iCloud format
                const isAllDay = !!event.start?.date && !event.start?.dateTime;
                const startStr = event.start?.dateTime || event.start?.date || event.start;
                const endStr = event.end?.dateTime || event.end?.date || event.end;

                return {
                    id: event.id,
                    userId: event.userId || this.userId,
                    start: typeof startStr === 'string' ? new Date(startStr) : startStr,
                    end: typeof endStr === 'string' ? new Date(endStr) : endStr,
                    title: event.summary || event.title || '(No title)',
                    isAllDay: isAllDay,
                };
            });
        } catch (error) {
            console.error('Error loading calendar events:', error);
            return [];
        }
    }
}
