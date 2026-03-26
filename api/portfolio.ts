import { kv } from '@vercel/kv';
import { VercelRequest, VercelResponse } from '@vercel/node';

const KV_KEY = 'portfolio_data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const data = await kv.get(KV_KEY);
      if (!data) {
        return res.status(200).json({ status: 'no_data' });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error('KV GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const newData = req.body;
      await kv.set(KV_KEY, newData);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('KV SET error:', error);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
