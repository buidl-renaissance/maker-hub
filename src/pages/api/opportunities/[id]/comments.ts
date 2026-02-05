import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/db/drizzle';
import { opportunityComments } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from '@/db/user';

async function getUserFromRequest(req: NextApiRequest) {
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/user_session=([^;]+)/);
  if (sessionMatch && sessionMatch[1]) {
    return await getUserById(sessionMatch[1]);
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { id } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Opportunity ID is required' });
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { content } = req.body;
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const comment = {
      id: uuidv4(),
      opportunityId: id,
      userId: user.id,
      content: content.trim(),
    };

    await db.insert(opportunityComments).values(comment);

    return res.status(201).json({
      success: true,
      comment: {
        ...comment,
        createdAt: new Date(),
        user: {
          id: user.id,
          displayName: user.displayName,
          username: user.username,
          pfpUrl: user.pfpUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ error: 'Failed to create comment' });
  }
}
