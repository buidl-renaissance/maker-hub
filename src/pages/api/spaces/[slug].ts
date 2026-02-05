import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/db/drizzle';
import { spaces, events, opportunities, users } from '@/db/schema';
import { eq, gte, and, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { slug } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required' });
  }

  try {
    // Get space by slug
    const spaceResults = await db
      .select()
      .from(spaces)
      .where(eq(spaces.slug, slug))
      .limit(1);

    if (spaceResults.length === 0) {
      return res.status(404).json({ error: 'Space not found' });
    }

    const space = spaceResults[0];

    // Get upcoming events at this space (match by location containing space name)
    const now = new Date();
    const upcomingEvents = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        location: events.location,
        imageUrl: events.imageUrl,
        eventDate: events.eventDate,
        startTime: events.startTime,
        endTime: events.endTime,
        isExternal: events.isExternal,
        externalUrl: events.externalUrl,
        createdAt: events.createdAt,
        creatorId: events.creatorId,
        creatorUsername: users.username,
        creatorDisplayName: users.displayName,
        creatorPfpUrl: users.pfpUrl,
      })
      .from(events)
      .leftJoin(users, eq(events.creatorId, users.id))
      .where(gte(events.eventDate, now))
      .orderBy(events.eventDate)
      .limit(5);

    // Get opportunities tied to this space
    const spaceOpportunities = await db
      .select({
        id: opportunities.id,
        title: opportunities.title,
        description: opportunities.description,
        type: opportunities.type,
        status: opportunities.status,
        createdAt: opportunities.createdAt,
        postedById: opportunities.postedById,
        postedByName: users.displayName,
        postedByUsername: users.username,
      })
      .from(opportunities)
      .leftJoin(users, eq(opportunities.postedById, users.id))
      .where(
        and(
          eq(opportunities.spaceId, space.id),
          eq(opportunities.status, 'active')
        )
      )
      .orderBy(desc(opportunities.createdAt))
      .limit(3);

    // Get organizer info if exists
    let organizer = null;
    if (space.organizerId) {
      const orgResult = await db
        .select({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          pfpUrl: users.pfpUrl,
        })
        .from(users)
        .where(eq(users.id, space.organizerId))
        .limit(1);
      organizer = orgResult[0] || null;
    }

    return res.status(200).json({
      space: {
        ...space,
        tools: space.tools ? JSON.parse(space.tools) : [],
      },
      events: upcomingEvents.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        imageUrl: e.imageUrl,
        eventDate: e.eventDate,
        startTime: e.startTime,
        endTime: e.endTime,
        isExternal: e.isExternal,
        externalUrl: e.externalUrl,
        createdAt: e.createdAt,
        creator: {
          id: e.creatorId,
          username: e.creatorUsername,
          displayName: e.creatorDisplayName,
          pfpUrl: e.creatorPfpUrl,
        },
        rsvpCount: 0,
      })),
      opportunities: spaceOpportunities,
      organizer,
    });
  } catch (error) {
    console.error('Error fetching space:', error);
    return res.status(500).json({ error: 'Failed to fetch space' });
  }
}
