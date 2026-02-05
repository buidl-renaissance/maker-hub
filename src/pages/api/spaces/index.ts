import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/db/drizzle';
import { spaces, events, users } from '@/db/schema';
import { eq, like, or, desc, gte, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    try {
      const { search, tools, beginnerFriendly, membership } = req.query;

      let query = db.select().from(spaces);
      const conditions: ReturnType<typeof eq>[] = [];

      // Search by name or neighborhood
      if (search && typeof search === 'string' && search.trim()) {
        const term = `%${search.trim()}%`;
        conditions.push(
          or(
            like(spaces.name, term),
            like(spaces.neighborhood, term)
          )!
        );
      }

      // Filter by beginner-friendly
      if (beginnerFriendly === 'true') {
        conditions.push(eq(spaces.isBeginnerFriendly, true));
      }

      // Filter by membership required
      if (membership === 'true') {
        conditions.push(eq(spaces.requiresMembership, true));
      }
      if (membership === 'false') {
        conditions.push(eq(spaces.requiresMembership, false));
      }

      const allSpaces = await query.orderBy(desc(spaces.isFeatured), spaces.name);

      // Filter by tools client-side since it's stored as JSON
      let filtered = allSpaces;
      if (tools && typeof tools === 'string') {
        const toolFilter = tools.split(',');
        filtered = allSpaces.filter(s => {
          if (!s.tools) return false;
          try {
            const spaceTools = JSON.parse(s.tools) as string[];
            return toolFilter.some(t => spaceTools.includes(t));
          } catch {
            return false;
          }
        });
      }

      // Apply other conditions by filtering
      if (conditions.length > 0) {
        // Re-query with conditions
        const baseResults = await db.select().from(spaces);
        const searchTerm = search && typeof search === 'string' ? search.trim().toLowerCase() : null;
        const isBeginner = beginnerFriendly === 'true';
        const membershipFilter = membership;

        filtered = baseResults.filter(s => {
          if (searchTerm) {
            const nameMatch = s.name.toLowerCase().includes(searchTerm);
            const neighborhoodMatch = s.neighborhood?.toLowerCase().includes(searchTerm);
            if (!nameMatch && !neighborhoodMatch) return false;
          }
          if (isBeginner && !s.isBeginnerFriendly) return false;
          if (membershipFilter === 'true' && !s.requiresMembership) return false;
          if (membershipFilter === 'false' && s.requiresMembership) return false;
          if (tools && typeof tools === 'string') {
            const toolFilter = tools.split(',');
            if (!s.tools) return false;
            try {
              const spaceTools = JSON.parse(s.tools) as string[];
              if (!toolFilter.some(t => spaceTools.includes(t))) return false;
            } catch {
              return false;
            }
          }
          return true;
        });

        // Sort: featured first, then alphabetical
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        });
      }

      // Get next event for each space
      const now = new Date();
      const nextEvents = await db
        .select({
          id: events.id,
          title: events.title,
          location: events.location,
          eventDate: events.eventDate,
        })
        .from(events)
        .where(gte(events.eventDate, now))
        .orderBy(events.eventDate);

      // Build a map of location -> next event (simple heuristic matching)
      const spaceNextEvent = new Map<string, { id: string; title: string; eventDate: Date }>();
      for (const space of filtered) {
        if (space.name) {
          const match = nextEvents.find(e =>
            e.location?.toLowerCase().includes(space.name.toLowerCase())
          );
          if (match) {
            spaceNextEvent.set(space.id, { id: match.id, title: match.title, eventDate: match.eventDate });
          }
        }
      }

      const result = filtered.map(s => ({
        ...s,
        tools: s.tools ? JSON.parse(s.tools) : [],
        nextEvent: spaceNextEvent.get(s.id) || null,
      }));

      return res.status(200).json({ spaces: result });
    } catch (error) {
      console.error('Error fetching spaces:', error);
      return res.status(500).json({ error: 'Failed to fetch spaces' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
