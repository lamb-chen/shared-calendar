import express from 'express';
import { googleAuthService } from '../services/googleAuth';
import { icloudAuthService } from '../services/icloudAuth';
import { db } from '../db';

const router = express.Router();

router.get('/users/:id', (req, res) => {
    try {
        const user = googleAuthService.getUser(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch events from ALL connected calendar accounts for a user
router.get('/calendar/all-events/:primaryUserId', async (req, res) => {
    try {
        const primaryUserId = req.params.primaryUserId;

        // Get all calendar accounts for this user (could be multiple providers)
        // For now, we'll get all accounts since we don't have a proper user table
        // In production, you'd link calendar_accounts to a users table
        const stmt = db.prepare('SELECT user_id, provider FROM calendar_accounts');
        const accounts = stmt.all() as any[];

        if (accounts.length === 0) {
            res.json([]);
            return;
        }

        const allEvents: any[] = [];

        // Fetch events from each connected account
        for (const account of accounts) {
            try {
                let events;
                if (account.provider === 'google') {
                    events = await googleAuthService.getCalendarEvents(account.user_id);
                } else if (account.provider === 'icloud') {
                    events = await icloudAuthService.getCalendarEvents(account.user_id);
                } else {
                    continue; // Skip unsupported providers
                }

                // Tag each event with its user_id for display
                if (events && Array.isArray(events)) {
                    const taggedEvents = events.map((event: any) => ({
                        ...event,
                        userId: '1', // Map all to current user (userId '1' in frontend)
                    }));

                    allEvents.push(...taggedEvents);
                }
            } catch (error: any) {
                console.error(`Error fetching events from ${account.provider} (${account.user_id}):`, error);
                // Continue with other accounts even if one fails
            }
        }

        res.json(allEvents);
    } catch (error: any) {
        console.error('Error fetching all events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.get('/calendar/:userId/events', async (req, res) => {
    try {
        // Check which provider this user is using
        const stmt = db.prepare('SELECT provider FROM calendar_accounts WHERE user_id = ?');
        const account = stmt.get(req.params.userId) as any;

        if (!account) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        let events;
        if (account.provider === 'google') {
            events = await googleAuthService.getCalendarEvents(req.params.userId);
        } else if (account.provider === 'icloud') {
            events = await icloudAuthService.getCalendarEvents(req.params.userId);
        } else {
            res.status(400).json({ error: 'Unsupported provider' });
            return;
        }

        res.json(events);
    } catch (error: any) {
        console.error('Error fetching events:', error);

        // Check if it's an auth error
        if (error.message === 'Unauthorized') {
            res.status(401).json({ error: 'Authentication expired. Please reconnect your calendar.' });
            return;
        }

        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Check if user has iCloud connected
router.get('/calendar/icloud/status', (req, res) => {
    try {
        const stmt = db.prepare('SELECT user_id, external_email FROM calendar_accounts WHERE provider = \'icloud\'');
        const account = stmt.get() as any;

        if (!account) {
            res.json({ connected: false });
            return;
        }

        res.json({
            connected: true,
            email: account.external_email,
            userId: account.user_id
        });
    } catch (error) {
        console.error('Error checking iCloud status:', error);
        res.status(500).json({ error: 'Failed to check iCloud status' });
    }
});

// Remove iCloud connection
router.delete('/calendar/icloud/:userId', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM calendar_accounts WHERE user_id = ? AND provider = \'icloud\'');
        const result = stmt.run(req.params.userId);

        if ((result as any).changes === 0) {
            res.status(404).json({ error: 'iCloud account not found' });
            return;
        }

        res.json({ success: true, message: 'iCloud account disconnected' });
    } catch (error) {
        console.error('Error removing iCloud account:', error);
        res.status(500).json({ error: 'Failed to remove iCloud account' });
    }
});

export default router;
