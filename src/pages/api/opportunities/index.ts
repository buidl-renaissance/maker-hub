import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/db/drizzle';
import { opportunities, spaces, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from '@/db/user';

async function getUserFromRequest(req: NextApiRequest) {
  if (req.query.userId && typeof req.query.userId === 'string') {
    return await getUserById(req.query.userId);
  }
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/user_session=([^;]+)/);
  if (sessionMatch && sessionMatch[1]) {
    return await getUserById(sessionMatch[1]);
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    try {
      const { type, spaceId } = req.query;

      const conditions: ReturnType<typeof eq>[] = [
        eq(opportunities.status, 'active'),
      ];

      if (type && typeof type === 'string') {
        conditions.push(eq(opportunities.type, type as any));
      }

      if (spaceId && typeof spaceId === 'string') {
        conditions.push(eq(opportunities.spaceId, spaceId));
      }

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
        .where(and(...conditions))
        .orderBy(desc(opportunities.createdAt));

      // Get space names for each opportunity
      const spaceIds = [...new Set(results.filter(r => r.spaceId).map(r => r.spaceId!))];
      const spaceNames = new Map<string, { name: string; slug: string }>();

      if (spaceIds.length > 0) {
        const spaceResults = await db.select({ id: spaces.id, name: spaces.name, slug: spaces.slug }).from(spaces);
        for (const s of spaceResults) {
          spaceNames.set(s.id, { name: s.name, slug: s.slug });
        }
      }

      const formatted = results.map(r => ({
        ...r,
        space: r.spaceId ? spaceNames.get(r.spaceId) || null : null,
        postedBy: {
          id: r.postedById,
          displayName: r.postedByName,
          username: r.postedByUsername,
          pfpUrl: r.postedByPfpUrl,
        },
      }));

      return res.status(200).json({ opportunities: formatted });
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      return res.status(500).json({ error: 'Failed to fetch opportunities' });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { title, description, type, spaceId, contactInfo, expiresAt } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!description || typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({ error: 'Description is required' });
      }
      if (!type) {
        return res.status(400).json({ error: 'Opportunity type is required' });
      }

      const newOpp = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        type,
        postedById: user.id,
        spaceId: spaceId || null,
        contactInfo: contactInfo?.trim() || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      };

      await db.insert(opportunities).values(newOpp);

      return res.status(201).json({ success: true, opportunity: newOpp });
    } catch (error) {
      console.error('Error creating opportunity:', error);
      return res.status(500).json({ error: 'Failed to create opportunity' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
