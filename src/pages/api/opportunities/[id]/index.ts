import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/db/drizzle';
import { opportunities, opportunityComments, spaces, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const results = await db
      .select({
        id: opportunities.id,
        title: opportunities.title,
        description: opportunities.description,
        type: opportunities.type,
        status: opportunities.status,
        spaceId: opportunities.spaceId,
        contactInfo: opportunities.contactInfo,
        expiresAt: opportunities.expiresAt,
        createdAt: opportunities.createdAt,
        postedById: opportunities.postedById,
        postedByName: users.displayName,
        postedByUsername: users.username,
        postedByPfpUrl: users.pfpUrl,
      })
      .from(opportunities)
      .leftJoin(users, eq(opportunities.postedById, users.id))
      .where(eq(opportunities.id, id))
      .limit(1);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const opp = results[0];

    // Get space info if linked
    let space = null;
    if (opp.spaceId) {
      const spaceResults = await db
        .select({ id: spaces.id, name: spaces.name, slug: spaces.slug })
        .from(spaces)
        .where(eq(spaces.id, opp.spaceId))
        .limit(1);
      space = spaceResults[0] || null;
    }

    // Get comments
    const comments = await db
      .select({
        id: opportunityComments.id,
        content: opportunityComments.content,
        createdAt: opportunityComments.createdAt,
        userId: opportunityComments.userId,
        userName: users.displayName,
        userUsername: users.username,
        userPfpUrl: users.pfpUrl,
      })
      .from(opportunityComments)
      .leftJoin(users, eq(opportunityComments.userId, users.id))
      .where(eq(opportunityComments.opportunityId, id))
      .orderBy(opportunityComments.createdAt);

    return res.status(200).json({
      opportunity: {
        ...opp,
        space,
        postedBy: {
          id: opp.postedById,
          displayName: opp.postedByName,
          username: opp.postedByUsername,
          pfpUrl: opp.postedByPfpUrl,
        },
      },
      comments: comments.map(c => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
          id: c.userId,
          displayName: c.userName,
          username: c.userUsername,
          pfpUrl: c.userPfpUrl,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
}
