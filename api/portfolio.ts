import { createClient } from '@vercel/kv';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback for environmental variables provided by different Redis/KV integrations
const kv = createClient({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const KV_KEY = 'portfolio_data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] Method: ${req.method}, Environment: ${process.env.NODE_ENV}`);
  
  if (!process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
    console.warn('[API] Warning: No KV/Redis environment variables detected.');
  }

  if (req.method === 'GET') {
    try {
      const data = await kv.get(KV_KEY);
      if (!data) {
        console.log('[API] No data found in KV.');
        return res.status(200).json({ status: 'no_data' });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error('[API] KV GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch data', detail: error instanceof Error ? error.message : String(error) });
    }
  }

  if (req.method === 'POST') {
    try {
      const newData = req.body;
      await kv.set(KV_KEY, newData);
      console.log('[API] Successfully saved data to KV.');
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('[API] KV SET error:', error);
      return res.status(500).json({ error: 'Failed to save data', detail: error instanceof Error ? error.message : String(error) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
