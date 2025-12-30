import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple mock: respond with an empty data object or small sample set depending on query
  try {
    const body = req.body || {};
    // You can enhance this mock to return products when query contains 'products' or similar
    const data = {};
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'mock error' });
  }
}
