import { put, list } from '@vercel/blob';
import { VercelRequest, VercelResponse } from '@vercel/node';

const BLOB_FILENAME = 'portfolio_data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] Method: ${req.method}, Environment: ${process.env.NODE_ENV}`);

  if (req.method === 'GET') {
    try {
      // Find the file in Blob storage
      const { blobs } = await list({ prefix: BLOB_FILENAME });
      
      if (blobs.length === 0) {
        console.log('[API] No data found in Blob storage.');
        return res.status(200).json({ status: 'no_data' });
      }

      // Vercel Blob URLs are public, we can fetch the data
      // We take the first one (most recent if we keep it clean)
      const latestBlob = blobs[0];
      const response = await fetch(latestBlob.url);
      const data = await response.json();
      
      return res.status(200).json(data);
    } catch (error) {
      console.error('[API] Blob GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch data', detail: error instanceof Error ? error.message : String(error) });
    }
  }

  if (req.method === 'POST') {
    try {
      const newData = req.body;
      
      // Save data as a JSON file in Vercel Blob
      // addRandomSuffix: false ensures we overwrite/replace the previous one if possible, 
      // or at least keep the name consistent in the list.
      const blob = await put(BLOB_FILENAME, JSON.stringify(newData), {
        access: 'public',
        addRandomSuffix: false,
      });

      console.log('[API] Successfully saved data to Blob:', blob.url);
      return res.status(200).json({ success: true, url: blob.url });
    } catch (error) {
      console.error('[API] Blob PUT error:', error);
      return res.status(500).json({ error: 'Failed to save data', detail: error instanceof Error ? error.message : String(error) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
